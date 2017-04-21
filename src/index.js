// https://jsfiddle.net/tovic/Xcb8d/

const DEFAULTS = {
  placeholderClassName: "placeholder",
  draggableSelector: null
};

export default class Dragger {
  constructor({ element, opts = {} }) {
    if (!(element instanceof Node)) {
      throw Error("`element` is not an instance of `Node`");
    }

    Object.assign(this, {
      element,
      opts: Object.assign({}, DEFAULTS, opts),
      handleElement: null,
      placeholderElement: null,
      placeholderPosition: { top: 0, left: 0 }      
    });

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.bindDraggableElements();
  }

  handleMouseUp(ev) {
    this.reset();
  }

  handleMouseDown({ target }) {
    this.placeholderElement = target; 
    this.placeholderElement.classList.add("placeholder");

    const placeholder = target;
    const handle = placeholder.cloneNode(true);
    placeholder.parentNode.appendChild(handle);
    const { left, top, width, height } = target.getBoundingClientRect();

    placeholder.classList.add(this.opts.placeholderClassName);
    Object.assign(handle, {
      position: "absolute",
      width: `${width}px`,
      height: `${height}px`
    });

    Object.assign(this.placeholderPosition, { left, top });
    this.placeholderElement = placeholder;
    this.handleElement = handle;
  }

  positionHandle({ clientX, clientY }) {
    window.requestAnimationFrame(() => {
      const el = this.handleElement;
      const { left, top } = this.placeholderPosition;
      const x = clientX - left;
      const y = clientY - top;
      Object.assign(el.style, {
        left: `${x}px`,
        top: `${y}px`
      });
    });
  }

  reset() {
    const { handleElement, placeholderElement } = this;
    if (!(handleElement instanceof Node)) return;
    placeholderElement.classList.remove("placeholder");
    this.placeholderElement = null;
    handleElement.parentNode.removeChild(handleElement)
    this.handleElement = null;
  }

  handleMouseMove({ clientX, clientY }) {
    if (!(this.handleElement instanceof Node)) return;
    this.positionHandle({ clientX, clientY });
  }

  getDraggableElements() {
    if (this.children) return this.children;
    this.children = this.opts.draggableSelector ? this.element.querySelectorAll(this.opts.draggableSelector) : this.element.children;
    return this.children;
  }

  bindDraggableElements() {
    const children = this.getDraggableElements();
    Array.from(children).forEach((el) => {
      const { position } = el.style;
      if (!position || position === "static") el.style.position = "relative";
      el.addEventListener('mousedown', this.handleMouseDown);
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    });
  }
};
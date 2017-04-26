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
      placeholderElement: null
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
    this.init(target);
  }

  positionHandle({ clientX, clientY }) {
    const { placeholderElement, handleElement, element } = this;
    const c = element.getBoundingClientRect();
    const p = placeholderElement.getBoundingClientRect();
    const x = (() => {
      const pos = clientX - p.width / 2; // clientX - c.left + p.left;
      if (pos < c.left) return c.left;
      if (pos > c.right - p.width) return c.right - p.width;
      return pos;
    })();
    const y = (() => {
      const pos = clientY - p.height;
      if (pos < c.top) return c.top;
      if (pos > c.bottom) return c.bottom - p.height
      return pos;
    })();
    window.requestAnimationFrame(() => {
      Object.assign(handleElement.style, {
        position: "absolute",
        width: `${p.width}px`,
        height: `${p.height}px`,
        left: `${x}px`,
        top: `${y}px`
      });
    });
  }

  init(element) {
    const placeholder = this.placeholderElement = element;
    const handle = this.handleElement = placeholder.cloneNode(true);

    const { left, top, width, height } = placeholder.getBoundingClientRect();
    placeholder.parentNode.appendChild(handle);
    placeholder.classList.add(this.opts.placeholderClassName);
    Object.assign(handle.style, {
      position: "absolute",
      width: `${width}px`,
      height: `${height}px`
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
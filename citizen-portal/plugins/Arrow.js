export class Arrow {
  /**
   * Pass in (window, document, undefined) to have an unmodified version of the variable in our function scope
   *
   * @param window
   * @param document
   * @param image
   */
  constructor(window, document, image = 'primary') {
    this.version = '1.0.9'
    this.image = null
    this.arrowNode = null
    this.browser = ''
    this.browserVersion = 0
    this.visibleHeight = 0
    this.visibleWidth = 0
    this.window = window
    this.document = document
    this.browserInfo()
    this._initArrow(image)
  }

  /**
   * Determine browser type and browser version
   */
  browserInfo() {
    const N = navigator.appName
    const ua = navigator.userAgent
    let tem = null
    let M = ua.match(
      /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i
    )
    /* eslint: disable-next-line */
    if (M && (tem = ua.match(/version\/([\d]+)/i)) != null) {
      M[2] = tem[1]
    }
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?']
    if (M[0].toLowerCase() === 'netscape') {
      this.browser = 'IE11'
    } else if (ua.toLowerCase().includes('edge')) {
      this.browser = 'edge'
    } else {
      this.browser = M[0].toLowerCase()
    }
    this.browserVersion = parseInt(M[1], 10)
  }

  /**
   * Fade in the arrow
   * Use DXImageTransform.Microsoft.Alpha for IE8
   *
   * @param milliseconds
   * @private
   */
  _increaseOpacity(milliseconds) {
    const arrow = this.document.getElementById('arrow-' + this.browser)
    arrow.style.display = 'block'
    let i = 0.0
    let ieI = 0 // need to use whole numbers for IE filter
    const x = setInterval(function () {
      i += 0.5
      ieI += 10
      if (this.browser === 'msie' && this.browserVersion <= 8) {
        if (arrow.filters) {
          arrow.filters.item('DXImageTransform.Microsoft.Alpha').opacity = ieI
        }
      } else {
        arrow.style.opacity = i
      }
    }, 50)
    setTimeout(function () {
      clearInterval(x)
    }, 600)
    const that = this
    setTimeout(function () {
      that._hide()
    }, milliseconds)
  }

  /**
   * Fade out the arrow
   * Use DXImageTransform.Microsoft.Alpha for IE8
   *
   * @method _decreaseOpacity
   * @private
   */
  _decreaseOpacity() {
    const arrow = this.document.getElementById('arrow-' + this.browser)
    let i = 1.0
    let ieI = 100 // need to use whole numbers for IE filter
    const x = setInterval(function () {
      i -= 0.1
      ieI -= 10
      if (this.browser === 'msie' && this.browserVersion <= 8) {
        if (arrow.filters) {
          arrow.filters.item('DXImageTransform.Microsoft.Alpha').opacity = ieI
        }
      } else {
        arrow.style.opacity = i
      }
    }, 50)
    setTimeout(function () {
      clearInterval(x)
      arrow.style.display = 'none'
    }, 600)
  }

  /**
   * Apply modern browser style then browser specific styles to arrow
   *
   * @method _applyStyleModern
   * @param node
   * @private
   */
  _applyStyleModern(node) {
    node.style.position = 'fixed'
    node.style.zIndex = 99999
    node.style.display = 'none'
    node.style.height = '309px'
    node.style.width = '186px'
    node.style.opacity = 0
    node.style.backgroundImage = `url(${this.image})`
    node.style.backgroundRepeat = 'no-repeat'
    node.style.backgroundPositionX = '0'
    node.style.backgroundPositionY = '0'
  }

  /**
   * IE 8 specific styles.
   *
   * @method _applyStyleIE8
   * @param node
   * @private
   */
  _applyStyleIE8(node) {
    node.style.top = '10px'
    node.style.left = '20px'

    // Only one filter style can exist so we concatenate them to one line
    const opacity = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0) '
    const imgSrc = `progid:DXImageTransform.Microsoft.AlphaImageLoader(src="${this.image}", sizingMethod="scale") `
    const rotation =
      'progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=1.2246063538223773e-16, M21=-1.2246063538223773e-16, M22=-1, SizingMethod="auto expand") '

    node.style.filter = opacity + imgSrc + rotation

    /*
     * CSS looks like this
     *
     * filter: progid:DXImageTransform.Microsoft.Matrix(
     *    M11 = COS_THETA,
     *    M12 = -SIN_THETA,
     *    M21 = SIN_THETA,
     *    M22 = COS_THETA,
     *    sizingMethod = 'auto expand'
     * )
     *
     * ---
     * How to access IE filters with JS
     *
     * node.filters.item('DXImageTransform.Microsoft.Alpha').opacity = 0
     * node.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = 'https://i.imgur.com/aMwoyfN.png'
     * node.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').sizingMethod = 'scale'
     * node.filters.item('DXImageTransform.Microsoft.Matrix').M11 = 1
     * node.filters.item('DXImageTransform.Microsoft.Matrix').M12 = 1.2246063538223773e-16
     * node.filters.item('DXImageTransform.Microsoft.Matrix').M21 = -1.2246063538223773e-16
     * node.filters.item('DXImageTransform.Microsoft.Matrix').M22 = -1
     * node.filters.item('DXImageTransform.Microsoft.Matrix').SizingMethod = 'auto expand'
     *
     */
  }

  /**
   * IE 9 styles (positioning in this case since we need no rotations).
   *
   * @method _applyStyleMs
   * @param node
   * @private
   */
  _applyStyleMs(node) {
    node.style.bottom = '50px'
    node.style.left = '67%'
  }

  /**
   * Firefox 20+ styles, 20+ is when new download manager was introduced.
   *
   * @method _applyStyleMoz
   * @param node
   * @private
   */
  _applyStyleMoz(node) {
    node.style.top = '0px'
    node.style.right = '37px'
    node.style.transform = 'rotateX(180deg) rotateY(180deg)'
    node.style.MozTransform = 'rotateX(180deg) rotateY(180deg)'
  }

  /**
   * Chrome's a simple one
   * P.S. We don't care of Safari or Opera right now
   *
   * @method _applyStyleWebkit
   * @param node
   * @private
   */
  _applyStyleWebkit(node) {
    node.style.bottom = '50px'
    node.style.left = '20px'
  }

  /**
   * Safari
   *
   * @method _applyStyleSafari
   * @param node
   * @private
   */
  _applyStyleSafari(node) {
    node.style.top = '0px'
    node.style.right = '80px'
    // node.style.transform = 'rotateX(180deg) rotateY(180deg)'
    node.style.webkitTransform = 'translate3d(0, 0, 0)'
    // node.style.webkitTransform = 'rotateX(180deg) rotateY(180deg)'
  }

  /**
   * Apply vendor specific styles based on the browser and browser version.
   *
   * @method _setStyleType
   * @param node
   * @private
   */
  _setStyleType(node) {
    // add our basic styles then do vendor prefixes
    this._applyStyleModern(node)
    if (this.browser === 'msie') {
      if (this.browserVersion === 8) {
        this._applyStyleIE8(node)
      } else if (this.browserVersion === 9 || this.browserVersion === 10) {
        this._applyStyleMs(node)
      }
    } else if (this.browser === 'chrome' || this.browser === 'opera') {
      this._applyStyleWebkit(node)
    } else if (this.browser === 'safari') {
      this._applyStyleSafari(node)
    } else if (this.browser === 'IE11' || this.browser === 'edge') {
      this._applyStyleMs(node)
    } else if (this.browser === 'firefox') {
      // New download manager with arrow introducted in version 20
      if (this.browserVersion >= 20) {
        this._applyStyleMoz(node)
      }
    }
  }

  /**
   * Create arrow element and give it an id specific to the browser.
   *
   * @method _buildArrow
   * @returns div {HTMLElement}
   * @private
   */
  _buildArrow() {
    const div = this.document.createElement('div')
    div.setAttribute('id', 'arrow-' + this.browser)
    this.arrowNode = div // only used in resizing ie9
    return div
  }

  /**
   * Add HTML node to the page, in this case our arrow.
   *
   * @method _injectNode
   * @param node
   * @private
   */
  _injectNode(node) {
    this.document.body.appendChild(node)
  }

  /**
   * Does our arrow exist on the page?
   *
   * @returns {boolean}
   * @private
   */
  _isExist() {
    return !!this.document.getElementById('arrow-' + this.browser)
  }

  /**
   * Initialize our arrow internals
   * ---
   * Should only be run once per Arrow instance.
   * In the future would be nice to manage multiple arrows.
   *
   * @method _initArrow
   * @private
   */
  _initArrow(image) {
    if (['green', 'orange', 'primary'].includes(image)) {
      this.image =
        this.browser === 'safari'
          ? require(`@/static/arrows/arrow_${image}_safari.png`)
          : require(`@/static/arrows/arrow_${image}.png`)
    } else {
      this.image =
        this.browser === 'safari'
          ? require(`@/static/arrows/arrow_${image}_safari.png`)
          : require(`@/static/arrows/arrow_${image}.png`)
    }
    let arrow
    if (this._isExist()) {
      arrow = this.document.getElementById('arrow-' + this.browser)
    } else {
      arrow = this._buildArrow()
    }

    this._setStyleType(arrow)
    this._calculateArrowPosition()
    this._injectNode(arrow)
    this._addWindowEvent('resize', this._calculateArrowPosition)
    this._addWindowEvent('scroll', this._calculateArrowPosition)
  }

  /**
   * Attach an event on the window object and a function to fire when it fires
   *
   * @method _addWindowEvent
   * @param event {string}
   * @param functionReference {Object}
   * @private
   */
  _addWindowEvent(event, functionReference) {
    if (this.window.addEventListener) {
      this.window.addEventListener(event, functionReference, false)
    } else if (this.window.attachEvent) {
      this.window.attachEvent(event, functionReference)
    }
  }

  /**
   * Calculate current visible height and width of the screen and stores them for library use.
   * ---
   * Used to make sure IE9 arrow is in the right place.
   * ---
   * !! Possible performance bottleneck for IE/other browser if something is constantly resizing the window.
   *
   * @method _calculateArrowPosition
   * @private
   */
  _calculateArrowPosition() {
    if (typeof this.window.innerWidth === 'number') {
      // Non-IE
      this.visibleWidth = this.window.innerWidth
      this.visibleHeight = this.window.innerHeight
    } else if (
      this.document.documentElement &&
      (this.document.documentElement.clientWidth ||
        this.document.documentElement.clientHeight)
    ) {
      // IE 6+ in 'standards compliant mode'
      this.visibleWidth = this.document.documentElement.clientWidth
      this.visibleHeight = this.document.documentElement.clientHeight
    }

    if (this.browser === 'msie' && this.browserVersion === 9) {
      if (this.visibleWidth < 1005) {
        this.arrowNode.style.bottom = '85px'
      } else if (this.visibleWidth > 1006) {
        this.arrowNode.style.bottom = '50px'
      }
    }
  }

  /**
   * Hide the arrow
   * If it doesn't exist it will throw an exception
   *
   * @method _hide
   */
  _hide() {
    if (this._isExist) {
      this._decreaseOpacity()
    }
  }

  /**
   * Public API
   */

  /**
   * Show the arrow.
   * If it doesn't exist it will throw an exception
   *
   * @method show
   * @param seconds {int} optional parameter, length in seconds to fade out after
   * @public
   */
  show(seconds = 6000) {
    if (this._isExist) {
      this._increaseOpacity(seconds)
    }
  }
}

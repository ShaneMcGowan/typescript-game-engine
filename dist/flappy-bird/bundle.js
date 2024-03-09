/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../core/client.ts":
/*!****************************!*\
  !*** ../../core/client.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Client: () => (/* binding */ Client)
/* harmony export */ });
/* harmony import */ var _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _utils_render_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/render.utils */ "../../core/utils/render.utils.ts");
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};


var Client = /** @class */ (function () {
    function Client(container, scenes, assets) {
        var _this = this;
        this.container = container;
        // Constants
        this.CANVAS_HEIGHT = _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_HEIGHT;
        this.CANVAS_WIDTH = _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_WIDTH;
        this.delta = 0;
        this.lastRenderTimestamp = 0;
        // Assets
        this.assets = {
            images: {},
            audio: {},
        };
        // Debug
        this.debug = {
            enabled: true, // if true, debug keys are enabled
            stats: {
                fps: false, // show fps
                fpsCounter: 0, // time since last check
                objectCount: false, // show object count
            },
            breakpoint: {
                frame: false,
            },
            timing: {
                frame: false,
                frameBackground: false,
                frameUpdate: false,
                frameRender: false,
            },
            ui: {
                grid: {
                    lines: false,
                    numbers: false,
                },
                canvasLayers: false,
            },
            object: {
                renderBoundary: false,
                renderBackground: false,
            },
        };
        // controllers
        this.gamepad = undefined;
        // scenes
        this.scenes = __spreadArray([], scenes, true);
        // load assets
        // TODO(smg): some sort of loading screen / rendering delay until assets are loaded
        Object.keys(assets.images).forEach(function (key) {
            _this.assets.images[key] = new Image();
            _this.assets.images[key].src = assets.images[key];
        });
        Object.keys(assets.audio).forEach(function (key) {
            _this.assets.audio[key] = new Audio(assets.audio[key]);
        });
        // initialise debug controls
        if (this.debug.enabled) {
            this.initialiseDebuggerListeners();
        }
        // initialise canvas
        this.canvas = this.createCanvas();
        this.context = _utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.getContext(this.canvas);
        // attach canvas to ui
        container.append(this.canvas);
        // go fullscreen
        this.canvas.addEventListener('click', function () {
            // this.canvas.requestFullscreen();
        });
        // handle tabbed out state
        document.addEventListener('visibilitychange', function (event) {
            if (document.visibilityState === 'visible') {
                // TODO(smg): pause frame execution
                console.log('tab is active');
            }
            else {
                // TODO(smg): continue frame execution
                console.log('tab is inactive');
            }
        });
        // initialise gamepad listeners
        this.intialiseGamepadListeners();
        // load first scene
        this.changeScene(this.scenes[0]);
        // Run game logic
        this.frame(0);
    }
    Client.prototype.createCanvas = function () {
        // create canvas
        var canvas = _utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.createCanvas();
        // prevent right click menu
        canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
        return canvas;
    };
    // TODO(smg): need some sort of scene class list type
    Client.prototype.changeScene = function (sceneClass) {
        this.currentScene = Reflect.construct(sceneClass, [this]);
    };
    /**
     * One frame of game logic
     * @param timestamp
     */
    Client.prototype.frame = function (timestamp) {
        if (this.debug.breakpoint.frame) {
            debugger;
        }
        if (this.debug.timing.frame) {
            console.log("[frame] ".concat(this.delta));
        }
        // Set Delata
        this.setDelta(timestamp);
        // Clear canvas before render
        _utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.clearCanvas(this.context);
        // run frame logic
        this.currentScene.frame(this.delta);
        // Render stats
        if (this.debug.stats.fps) {
            if (this.debug.stats.fpsCounter) {
                this.renderStats(0, 'FPS', "".concat(Math.round(1000 / ((performance.now() - this.debug.stats.fpsCounter))), " FPS"));
            }
            this.debug.stats.fpsCounter = timestamp;
        }
        if (this.debug.stats.objectCount) {
            this.renderStats(1, 'Objects', "".concat(this.currentScene.objects.length, " objects"));
        }
        // debug grid
        this.renderGrid();
        // check for map change
        if (this.currentScene.flaggedForMapChange) {
            this.currentScene.changeMap(this.currentScene.flaggedForMapChange);
        }
        // Call next frame
        // (we set `this` context for when using window.requestAnimationFrame)
        window.requestAnimationFrame(this.frame.bind(this));
    };
    /**
     * Calculate the time since the previous frame
     * @param timestamp
     */
    Client.prototype.setDelta = function (timestamp) {
        this.delta = (timestamp - this.lastRenderTimestamp) / 1000;
        this.lastRenderTimestamp = timestamp;
    };
    Client.prototype.renderStats = function (index, label, value) {
        this.context.fillStyle = 'red';
        this.context.font = '12px serif';
        this.context.fillText(value, this.CANVAS_WIDTH - 50, (index + 1) * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE);
    };
    Client.prototype.renderGrid = function () {
        if (this.debug.ui.grid.lines || this.debug.ui.grid.numbers) {
            _utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.fillRectangle(this.context, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, { colour: 'rgba(0, 0, 0, 0.25)', });
        }
        if (this.debug.ui.grid.lines) {
            for (var x = 0; x < this.CANVAS_WIDTH; x += _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) {
                for (var y = 0; y < this.CANVAS_HEIGHT; y += _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) {
                    _utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.strokeRectangle(this.context, x, y, _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE, _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE, 'black');
                }
            }
        }
        if (this.debug.ui.grid.numbers) {
            for (var x = 0; x < _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH; x++) {
                for (var y = 0; y < _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT; y++) {
                    this.context.fillStyle = 'black';
                    this.context.font = '8px helvetica';
                    this.context.fillText("".concat(x), (x * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + 1, (y * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + 8); // 8 is 8 px
                    this.context.fillText("".concat(y), (x * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + 6, (y * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + 14); // 16 is 16px
                }
            }
        }
    };
    Client.prototype.initialiseDebuggerListeners = function () {
        var _this = this;
        document.addEventListener('keyup', function (event) {
            switch (event.key) {
                case '1':
                    _this.debug.ui.grid.lines = !_this.debug.ui.grid.lines;
                    break;
                case '2':
                    _this.debug.ui.grid.numbers = !_this.debug.ui.grid.numbers;
                    break;
                case '3':
                    _this.debug.breakpoint.frame = !_this.debug.breakpoint.frame;
                    break;
                case '4':
                    _this.debug.stats.fps = !_this.debug.stats.fps;
                    break;
                case '5':
                    _this.debug.stats.objectCount = !_this.debug.stats.objectCount;
                    break;
                case '6':
                    _this.debug.timing.frame = !_this.debug.timing.frame;
                    break;
                case '7':
                    _this.debug.timing.frameBackground = !_this.debug.timing.frameBackground;
                    break;
                case '8':
                    _this.debug.timing.frameRender = !_this.debug.timing.frameRender;
                    break;
                case '9':
                    _this.debug.timing.frameUpdate = !_this.debug.timing.frameUpdate;
                    break;
                case '0':
                    _this.debug.ui.canvasLayers = !_this.debug.ui.canvasLayers;
                    break;
                case '+':
                    // nothing yet
                    break;
                case '-':
                    // nothing yet
                    break;
            }
        });
    };
    Client.prototype.intialiseGamepadListeners = function () {
        var _this = this;
        window.addEventListener('gamepadconnected', function (event) {
            console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.', event.gamepad.index, event.gamepad.id, event.gamepad.buttons.length, event.gamepad.axes.length);
            _this.gamepad = event.gamepad;
        });
        window.addEventListener('gamepaddisconnected', function (event) {
            _this.gamepad = undefined;
        });
    };
    return Client;
}());



/***/ }),

/***/ "../../core/constants/canvas.constants.ts":
/*!************************************************!*\
  !*** ../../core/constants/canvas.constants.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CanvasConstants: () => (/* binding */ CanvasConstants)
/* harmony export */ });
var CanvasConstants = /** @class */ (function () {
    function CanvasConstants() {
    }
    Object.defineProperty(CanvasConstants, "CANVAS_HEIGHT", {
        /**
         * Keep an eye on this and any getters, don't run it on hot code paths
         */
        get: function () {
            return CanvasConstants.TILE_SIZE * CanvasConstants.CANVAS_TILE_HEIGHT;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "CANVAS_WIDTH", {
        get: function () {
            return CanvasConstants.TILE_SIZE * CanvasConstants.CANVAS_TILE_WIDTH;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "ASPECT_RATIO", {
        get: function () {
            return CanvasConstants.CANVAS_TILE_HEIGHT / CanvasConstants.CANVAS_TILE_WIDTH;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "UI_RENDER_LAYER", {
        /**
         * The layer that UI elements should be rendered on
         */
        get: function () {
            return CanvasConstants.OBJECT_RENDERING_LAYERS - 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "UI_COLLISION_LAYER", {
        /**
         * The collision layer for UI elements so that game elements don't interact with them
         */
        get: function () {
            return CanvasConstants.OBJECT_COLLISION_LAYERS - 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "CANVAS_CENTER_TILE_Y", {
        get: function () {
            return this.CANVAS_TILE_HEIGHT / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "CANVAS_CENTER_TILE_X", {
        get: function () {
            return this.CANVAS_TILE_WIDTH / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "CANVAS_CENTER_PIXEL_X", {
        get: function () {
            return CanvasConstants.CANVAS_WIDTH / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasConstants, "CANVAS_CENTER_PIXEL_Y", {
        get: function () {
            return CanvasConstants.CANVAS_HEIGHT / 2;
        },
        enumerable: false,
        configurable: true
    });
    CanvasConstants.CANVAS_TILE_HEIGHT = 18; // total height in tiles
    CanvasConstants.CANVAS_TILE_WIDTH = 30; // total width in tiles
    CanvasConstants.TILE_SIZE = 16; // e.g. 32 means a pixel size of tile (32px x 32px)
    CanvasConstants.OBJECT_RENDERING_LAYERS = 16; // number of layers to render objects on. e.g. for a value of 16, 0 is the lowest layer, 15 is the highest
    CanvasConstants.OBJECT_COLLISION_LAYERS = 16; // number of layers on which objects can collide. e.g. for a value of 16, 0 is the lowest layer, 15 is the highest
    CanvasConstants.CONTEXT_IMAGE_SMOOTHING_ENABLED = false; // whether to enable image smoothing on the canvas context
    return CanvasConstants;
}());



/***/ }),

/***/ "../../core/model/scene-map.ts":
/*!*************************************!*\
  !*** ../../core/model/scene-map.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SceneMap: () => (/* binding */ SceneMap)
/* harmony export */ });
var SceneMap = /** @class */ (function () {
    function SceneMap(scene) {
        this.scene = scene;
        this.globals = {};
        this.context = this.scene.context;
        this.assets = this.scene.assets;
    }
    /**
     * Called when the map is destroyed
     */
    SceneMap.prototype.destroy = function () {
        // do nothing by default
    };
    return SceneMap;
}());



/***/ }),

/***/ "../../core/model/scene-object.ts":
/*!****************************************!*\
  !*** ../../core/model/scene-object.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SceneObject: () => (/* binding */ SceneObject)
/* harmony export */ });
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");


var DEFAULT_IS_RENDERABLE = false;
var DEFAULT_RENDER_LAYER = 0;
var DEFAULT_RENDER_OPACITY = 1;
var DEFAULT_RENDER_SCALE = 1;
var DEFAULT_HAS_COLLISION = false;
var DEFAULT_COLLISION_LAYER = 0;
var SceneObject = /** @class */ (function () {
    function SceneObject(scene, config) {
        var _a, _b, _c, _d, _e, _f;
        this.scene = scene;
        this.id = crypto.randomUUID();
        // position
        this.positionX = -1;
        this.positionY = -1;
        this.targetX = -1;
        this.targetY = -1;
        // dimensions
        this.width = 1;
        this.height = 1;
        // TODO(smg): I'm not convinced of this but I will go with it for now
        this.keyListeners = {}; // for keyboard events
        this.eventListeners = {}; // for scene events
        // flags
        this.flaggedForRender = true; // TODO(smg): implement the usage of this flag to improve engine performance
        this.flaggedForUpdate = true; // TODO(smg): implement the usage of this flag to improve engine performance
        this.flaggedForDestroy = false; // TODO(smg): implement this. used to remove object from scene on next update rather than mid update etc
        this.mainContext = this.scene.context;
        this.assets = this.scene.assets;
        // position default
        if (config.positionX !== undefined) {
            this.positionX = config.positionX;
            if (config.targetX === undefined) {
                this.targetX = this.positionX;
            }
        }
        if (config.positionY !== undefined) {
            this.positionY = config.positionY;
            if (config.targetY === undefined) {
                this.targetY = this.positionY;
            }
        }
        if (config.targetX !== undefined) {
            this.targetX = config.targetX;
        }
        if (config.targetY !== undefined) {
            this.targetY = config.targetY;
        }
        this.isRenderable = (_a = config.isRenderable) !== null && _a !== void 0 ? _a : DEFAULT_IS_RENDERABLE;
        this.renderLayer = (_b = config.renderLayer) !== null && _b !== void 0 ? _b : DEFAULT_RENDER_LAYER;
        this.renderOpacity = (_c = config.renderOpacity) !== null && _c !== void 0 ? _c : DEFAULT_RENDER_OPACITY;
        this.hasCollision = (_d = config.hasCollision) !== null && _d !== void 0 ? _d : DEFAULT_HAS_COLLISION;
        this.collisionLayer = (_e = config.collisionLayer) !== null && _e !== void 0 ? _e : DEFAULT_COLLISION_LAYER;
        this.renderScale = (_f = config.renderScale) !== null && _f !== void 0 ? _f : DEFAULT_RENDER_SCALE;
    }
    Object.defineProperty(SceneObject.prototype, "boundingBox", {
        // TODO(smg): Currently we are using positionX and positionY as the top left corner of the object
        // boundingX and boundingY are the bottom right corner of the object
        // I want to change this so that positionX and positionY are the center of the object (or whatever the user wants it to be)
        // I at least want it to be configurable.
        // boundingBox should then be used for all collisions and be based off of positionX and positionY and width and height
        // e.g. positionX = 5 and position Y = 10, width and height = 2 would mean the bounding box is
        // top: 9, (10 - (2 / 2) = 9)
        // right: 6, (5 + (2 / 2) = 6)
        // bottom: 11, (10 + (2 / 2) = 11
        // left: 4 (5 - (2 / 2) = 4
        // TODO(smg): this being a getter probably is quite slow if it's used a lot but it's fine for now
        get: function () {
            var xOffset = this.width / 2; // TODO(smg): this should be calculated based off of how the user wants the position to be calculated
            var yOffset = this.height / 2; // TODO(smg): same as above
            // return {
            //   top: this.positionY - yOffset,
            //   right: this.positionX + xOffset,
            //   bottom: this.positionY + yOffset,
            //   left: this.positionX - xOffset,
            // };
            return {
                top: this.positionY,
                right: this.positionX + this.width,
                bottom: this.positionY + this.height,
                left: this.positionX,
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Used for debugging
     * @param context
     */
    SceneObject.prototype.debuggerRenderBoundary = function (context) {
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_0__.RenderUtils.strokeRectangle(context, Math.floor(this.boundingBox.left * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.boundingBox.top * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.width * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.height * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), 'red');
    };
    /**
     * Used for debugging
     * @param context
     */
    SceneObject.prototype.debuggerRenderBackground = function (context) {
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_0__.RenderUtils.fillRectangle(context, this.boundingBox.left, this.boundingBox.top, Math.floor(this.width * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.height * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), { colour: 'red', });
    };
    Object.defineProperty(SceneObject.prototype, "cameraRelativePositionX", {
        get: function () {
            return this.positionX + this.scene.globals.camera.startX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneObject.prototype, "cameraRelativePositionY", {
        get: function () {
            return this.positionY + this.scene.globals.camera.startY;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneObject.prototype, "pixelWidth", {
        get: function () {
            return this.width * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneObject.prototype, "pixelHeight", {
        get: function () {
            return this.height * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE;
        },
        enumerable: false,
        configurable: true
    });
    SceneObject.prototype.isCollidingWith = function (object) {
        return this.isWithinHorizontalBounds(object) && this.isWithinVerticalBounds(object);
    };
    SceneObject.prototype.isWithinHorizontalBounds = function (object) {
        if (object.boundingBox.left >= this.boundingBox.left && object.boundingBox.left <= this.boundingBox.right) {
            return true;
        }
        if (object.boundingBox.right >= this.boundingBox.left && object.boundingBox.right <= this.boundingBox.right) {
            return true;
        }
        return false;
    };
    SceneObject.prototype.isWithinVerticalBounds = function (object) {
        if (object.boundingBox.top >= this.boundingBox.top && object.boundingBox.top <= this.boundingBox.bottom) {
            return true;
        }
        if (object.boundingBox.bottom >= this.boundingBox.top && object.boundingBox.bottom <= this.boundingBox.bottom) {
            return true;
        }
        return false;
    };
    return SceneObject;
}());



/***/ }),

/***/ "../../core/model/scene.ts":
/*!*********************************!*\
  !*** ../../core/model/scene.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scene: () => (/* binding */ Scene)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
/* harmony import */ var _core_utils_mouse_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/utils/mouse.utils */ "../../core/utils/mouse.utils.ts");



/**

  adding a quick description here as this shape is pretty gross but I think it will be somewhat performant at scale
  where <number> from left to right is, <scene index>, <x position>, <y position>, <animation timer in seconds>

  backgroundLayersAnimationTimer: Record<number, Record<number, Record<number, number>>>
  backgroundLayersAnimationTimer = {
    0: {
      0: {
        0: 0
      }
    }
  }

*/
var Scene = /** @class */ (function () {
    function Scene(client) {
        var _this = this;
        this.client = client;
        this.backgroundLayersAnimationTimer = {}; // used for timings for background layer animations
        // objects
        this.objects = [];
        // TODO(smg): how do we access types for this from the scene object?
        // a place to store flags for the scene
        this.globals = {
            mouse: {
                click: {
                    left: false,
                    middle: false,
                    right: false,
                },
                position: {
                    x: 0,
                    y: 0,
                    exactX: 0,
                    exactY: 0,
                },
            },
            camera: {
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0,
            },
            keyboard: {},
            latestMouseEvent: new MouseEvent(''),
        };
        // maps
        // TODO(smg): change this so you can pass in a map class directly and the type uses SceneMapConstructorSignature | undefined
        this.flaggedForMapChange = undefined; // if this is set, the scene will change to the map at the provided index on the next frame
        this.maps = []; // TODO(smg): some sort of better typing for this, it is a list of uninstanciated classes that extend SceneMap
        // rendering contexts
        this.renderingContext = {
            background: [],
            objects: [],
        };
        // for firing events
        this.eventEmitter = document.createElement('eventEmitter');
        this.eventTypes = {}; // TODO(smg): some way typing this so there is intellisense for event types for a scene
        this.backgroundLayerAnimationFrame = {};
        this.context = this.client.context;
        this.assets = this.client.assets;
        // set up mouse listener
        client.canvas.addEventListener('mousemove', function (event) {
            _this.globals.mouse.position = _core_utils_mouse_utils__WEBPACK_IMPORTED_MODULE_2__.MouseUtils.getMousePosition(client.canvas, event);
            _this.globals.latestMouseEvent = event;
        });
        // mouse
        client.canvas.addEventListener('mousedown', function (event) {
            console.log('[mousedown]', event);
            switch (event.button) {
                case 0:
                    _this.globals.mouse.click.left = true;
                    break;
                case 1:
                    _this.globals.mouse.click.middle = true;
                    break;
                case 2:
                    _this.globals.mouse.click.right = true;
                    break;
            }
        });
        client.canvas.addEventListener('mouseup', function (event) {
            console.log('[mouseup]', event);
            switch (event.button) {
                case 0:
                    _this.globals.mouse.click.left = false;
                    break;
                case 1:
                    _this.globals.mouse.click.middle = false;
                    break;
                case 2:
                    _this.globals.mouse.click.right = false;
                    break;
            }
        });
        // touch
        client.canvas.addEventListener('touchstart', function (event) {
            console.log('[touchstart]', event);
            _this.globals.mouse.click.left = true;
        });
        client.canvas.addEventListener('touchend', function (event) {
            console.log('[touchend]', event);
            _this.globals.mouse.click.left = false;
        });
        document.addEventListener('keydown', function (event) {
            if (event.repeat) {
                return;
            }
            console.log('[keydown]', event);
            _this.globals.keyboard[event.key.toLocaleLowerCase()] = true;
        });
        document.addEventListener('keyup', function (event) {
            if (event.repeat) {
                return;
            }
            console.log('[keyup]', event);
            _this.globals.keyboard[event.key.toLocaleLowerCase()] = false;
        });
    }
    // TODO(smg): move client rendering code into here
    Scene.prototype.frame = function (delta) {
        this.renderBackground(delta);
        this.updateObjects(delta);
        this.renderObjects(delta);
        if (this.customRenderer) {
            this.customRenderer(this.renderingContext);
        }
        else {
            this.defaultRenderer();
        }
    };
    Scene.prototype.renderBackground = function (delta) {
        var _this = this;
        if (this.client.debug.timing.frameBackground) {
            console.time('[frame] background');
        }
        this.backgroundLayers.forEach(function (layer, index) {
            var context = _this.renderingContext.background[index];
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.clearCanvas(context);
            for (var x = 0; x < _this.map.width; x++) {
                for (var y = 0; y < _this.map.height; y++) {
                    var tile = layer.tiles[x] ? layer.tiles[x][y] : undefined;
                    if (tile === undefined) {
                        continue;
                    }
                    var animationFrame = void 0;
                    if (tile.animationFrames.length === 1) {
                        // skip animations if only 1 sprite
                        animationFrame = tile.animationFrames[0];
                    }
                    else {
                        // check if timer has started for specific tile on specific layer
                        if (_this.backgroundLayersAnimationTimer[layer.index] === undefined) {
                            _this.backgroundLayersAnimationTimer[layer.index] = {};
                        }
                        if (_this.backgroundLayersAnimationTimer[layer.index][x] === undefined) {
                            _this.backgroundLayersAnimationTimer[layer.index][x] = {};
                        }
                        var timer = void 0;
                        if (_this.backgroundLayersAnimationTimer[layer.index][x][y] === undefined) {
                            timer = 0;
                        }
                        else {
                            timer = _this.backgroundLayersAnimationTimer[layer.index][x][y] + delta;
                        }
                        // wrap timer if over animation frame duration
                        if (timer > tile.animationFrameDuration) {
                            timer = timer % tile.animationFrameDuration;
                        }
                        for (var i = 0; i < tile.animationMap.length; i++) {
                            if (timer <= tile.animationMap[i]) {
                                animationFrame = tile.animationFrames[i];
                                break;
                            }
                        }
                        _this.backgroundLayersAnimationTimer[layer.index][x][y] = timer;
                    }
                    _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.renderSprite(context, _this.assets.images[tile.tileset], animationFrame.spriteX, animationFrame.spriteY, x, y);
                }
            }
        });
        if (this.client.debug.timing.frameBackground) {
            console.timeEnd('[frame] background');
        }
    };
    Scene.prototype.updateObjects = function (delta) {
        if (this.client.debug.timing.frameUpdate) {
            console.time('[frame] update');
        }
        this.objects.forEach(function (object) {
            if (object.update) {
                object.update(delta);
            }
        });
        if (this.client.debug.timing.frameUpdate) {
            console.timeEnd('[frame] update');
        }
    };
    Scene.prototype.renderObjects = function (delta) {
        var _this = this;
        if (this.client.debug.timing.frameRender) {
            console.time('[frame] render');
        }
        // clear object canvases
        this.renderingContext.objects.forEach(function (context) {
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.clearCanvas(context);
        });
        // render objects
        this.objects.forEach(function (object) {
            if (_this.client.debug.object.renderBackground) {
                object.debuggerRenderBackground(_this.renderingContext.objects[object.renderLayer]);
            }
            if (object.render && object.isRenderable) {
                object.render(_this.renderingContext.objects[object.renderLayer]);
            }
            if (_this.client.debug.object.renderBoundary) {
                object.debuggerRenderBoundary(_this.renderingContext.objects[object.renderLayer]);
            }
        });
        if (this.client.debug.timing.frameRender) {
            console.timeEnd('[frame] render');
        }
    };
    Scene.prototype.defaultRenderer = function () {
        var _this = this;
        // set camera positions
        this.globals.camera.startX = 0;
        this.globals.camera.startY = 0;
        this.globals.camera.endX = 0;
        this.globals.camera.endY = 0;
        // render
        this.renderingContext.background.forEach(function (context) {
            _this.context.drawImage(context.canvas, 0, 0);
        });
        this.renderingContext.objects.forEach(function (context) {
            _this.context.drawImage(context.canvas, 0, 0);
        });
    };
    Scene.prototype.addObject = function (sceneObject) {
        this.objects.push(sceneObject);
    };
    // TODO(smg): I am rethinking the concept of removing the object from the scene during another object's update.
    // I think it would be better to have a flag that is checked during the scene's update loop to rmove the obejct before it's next update
    // perhaps using flaggedForDestroy
    Scene.prototype.removeObject = function (sceneObject) {
        if (sceneObject.destroy) {
            sceneObject.destroy();
        }
        this.objects.splice(this.objects.indexOf(sceneObject), 1);
    };
    // TODO(smg): this prevents weird issues caused by calling removeObject multiple times directly for the same object but it is inefficient
    // review this at a later stage
    Scene.prototype.removeObjectById = function (sceneObjectId) {
        var object = this.objects.find(function (o) { return o.id === sceneObjectId; });
        if (object === undefined) {
            return;
        }
        this.removeObject(object);
    };
    /**
     * Returns all instances of the provided class
     * @param type
     * @returns
     */
    Scene.prototype.getObjectsByType = function (type) {
        // TODO(smg): horribly underperformant, perhaps use a hash on object type instead?
        return this.objects.filter(function (o) { return o instanceof type; });
    };
    /**
     * Checks if an object exists at the provided position and has collision
     * @param x
     * @param y
     * @returns
     */
    Scene.prototype.hasCollisionAtPosition = function (positionX, positionY, sceneObject) {
        var object = this.objects.find(function (o) { return o.positionX === positionX && o.positionY === positionY && o.hasCollision; });
        if (object === undefined) {
            return false;
        }
        // ignore provided object (usually self)
        if (sceneObject === object) {
            return false;
        }
        return true;
    };
    /**
     * Checks if an object is on it's way to the provided position and has collision
     * @param x
     * @param y
     * @returns
     */
    Scene.prototype.willHaveCollisionAtPosition = function (positionX, positionY, sceneObject) {
        var object = this.objects.find(function (o) { return o.targetX === positionX && o.targetY === positionY && o.hasCollision; });
        if (object === undefined) {
            return false;
        }
        // ignore provided object (usually self)
        if (sceneObject === object) {
            return false;
        }
        return true;
    };
    Scene.prototype.isOutOfBounds = function (positionX, positionY) {
        return (positionX > this.map.width - 1 || positionY > this.map.height - 1 || positionX < 0 || positionY < 0);
    };
    /**
     * A combination of hasCollisionAtPosition and willHaveCollisionAtPosition
     * @param positionX
     * @param positionY
     * @param sceneObject
     * @returns
     */
    Scene.prototype.hasOrWillHaveCollisionAtPosition = function (positionX, positionY, sceneObject) {
        return this.hasCollisionAtPosition(positionX, positionY, sceneObject) || this.willHaveCollisionAtPosition(positionX, positionY, sceneObject);
    };
    /**
     * returns the first object found at the provided position
     * @param positionX
     * @param positionY
     * @param type
     * @returns
     */
    Scene.prototype.getObjectAtPosition = function (positionX, positionY, type) {
        // TODO(smg): add optional type check
        // TODO(smg): this is a very heavy operation
        return this.objects.find(function (o) { return o.positionX === positionX && o.positionY === positionY && o.collisionLayer !== _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.UI_COLLISION_LAYER; });
    };
    /**
     * returns all objects found at the provided position
     * @param positionX
     * @param positionY
     * @param type
     * @returns
     */
    Scene.prototype.getAllObjectsAtPosition = function (positionX, positionY, type) {
        // TODO(smg): add optional type check
        // TODO(smg): this is a very heavy operation
        return this.objects.filter(function (o) { return o.positionX === positionX && o.positionY === positionY && o.collisionLayer !== _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.UI_COLLISION_LAYER; });
    };
    Scene.prototype.removeAllObjects = function () {
        while (this.objects.length > 0) {
            this.removeObject(this.objects[0]);
        }
        // this.objects = [];
    };
    Scene.prototype.removeAllBackgroundLayers = function () {
        this.backgroundLayers = [];
    };
    Scene.prototype.setUpRenderingContexts = function () {
        this.renderingContext = {
            background: [],
            objects: [],
        };
        for (var i = 0; i < this.backgroundLayers.length; i++) {
            var canvas = this.createCanvas();
            this.renderingContext.background[i] = _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.getContext(canvas);
        }
        for (var i = 0; i < _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.OBJECT_RENDERING_LAYERS; i++) {
            var canvas = this.createCanvas();
            this.renderingContext.objects[i] = _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.getContext(canvas);
        }
    };
    Scene.prototype.createCanvas = function () {
        var canvas = _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.createCanvas(this.map.width, this.map.height);
        if (this.client.debug.ui.canvasLayers) {
            this.client.container.append(canvas);
        }
        return canvas;
    };
    Scene.prototype.flagForMapChange = function (index) {
        this.flaggedForMapChange = index;
    };
    // TODO(smg): allow this to have a timer set for it
    Scene.prototype.changeMap = function (index) {
        var _a, _b;
        // clean up map
        if (this.map !== undefined) {
            this.map.destroy();
        }
        // clean up scene
        // TODO(smg): some sort of scene reset function
        this.removeAllObjects();
        this.removeAllBackgroundLayers();
        // set up new map
        console.log('[Scene] changing map to', index);
        this.map = Reflect.construct(this.maps[index], [this, this.context, this.assets]);
        (_a = this.backgroundLayers).push.apply(_a, this.map.backgroundLayers);
        (_b = this.objects).push.apply(_b, this.map.objects);
        // set up rendering contexts
        // custom renderers in objects for maps require this
        this.setUpRenderingContexts();
        // remove flag
        this.flaggedForMapChange = undefined;
    };
    Scene.prototype.changeScene = function (sceneClass) {
        this.client.changeScene(sceneClass);
    };
    Scene.prototype.setCustomRenderer = function (renderer) {
        this.customRenderer = renderer;
    };
    Scene.prototype.removeCustomerRenderer = function () {
        this.customRenderer = undefined;
    };
    Scene.prototype.addEventListener = function (eventName, callback) {
        this.eventEmitter.addEventListener(eventName, callback);
    };
    Scene.prototype.removeEventListener = function (eventName, callback) {
        this.eventEmitter.removeEventListener(eventName, callback);
    };
    Scene.prototype.dispatchEvent = function (eventName, detail) {
        var event = new CustomEvent(eventName, { detail: detail, });
        console.log('[dispatchEvent]', event);
        this.eventEmitter.dispatchEvent(event);
    };
    return Scene;
}());



/***/ }),

/***/ "../../core/model/sprite-animation.ts":
/*!********************************************!*\
  !*** ../../core/model/sprite-animation.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpriteAnimation: () => (/* binding */ SpriteAnimation)
/* harmony export */ });
var SpriteAnimation = /** @class */ (function () {
    function SpriteAnimation(tileset, frames) {
        this.tileset = tileset;
        this.frames = frames;
        this.duration = frames.reduce(function (acc, frame) { return acc + frame.duration; }, 0);
    }
    // returns the current frame of the animation based on the time
    SpriteAnimation.prototype.currentFrame = function (time) {
        var currentTime = time % this.duration;
        var currentDuration = 0;
        for (var i = 0; i < this.frames.length; i++) {
            currentDuration += this.frames[i].duration;
            if (currentTime < currentDuration) {
                return this.frames[i];
            }
        }
        return this.frames[0];
    };
    return SpriteAnimation;
}());



/***/ }),

/***/ "../../core/objects/interval.object.ts":
/*!*********************************************!*\
  !*** ../../core/objects/interval.object.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IntervalObject: () => (/* binding */ IntervalObject)
/* harmony export */ });
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var DEFAULT_DURATION = 1;
var DEFAULT_ON_INTERVAL = function () { };
/**
 * An object that runs a function at regular intervals
 */
var IntervalObject = /** @class */ (function (_super) {
    __extends(IntervalObject, _super);
    function IntervalObject(scene, config) {
        var _a, _b, _c;
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.timer = 0;
        _this.intervalsComplete = 0;
        _this.duration = (_a = config.duration) !== null && _a !== void 0 ? _a : DEFAULT_DURATION;
        _this.onInterval = (_b = config.onInterval) !== null && _b !== void 0 ? _b : DEFAULT_ON_INTERVAL;
        _this.onDestroy = (_c = config.onDestroy) !== null && _c !== void 0 ? _c : undefined;
        _this.maxIntervals = config.maxIntervals;
        return _this;
    }
    IntervalObject.prototype.update = function (delta) {
        this.timer += delta;
        if (this.timer >= this.duration) {
            this.onInterval();
            this.timer -= this.duration; // remove the duration from the timer rather than set to 0 to avoid drift
            this.intervalsComplete++;
            if (this.maxIntervals && this.intervalsComplete >= this.maxIntervals) {
                this.scene.removeObject(this);
            }
        }
    };
    IntervalObject.prototype.destroy = function () {
        if (this.onDestroy) {
            this.onDestroy();
        }
        console.log('[IntervalObject] destroyed');
    };
    return IntervalObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__.SceneObject));



/***/ }),

/***/ "../../core/objects/sprite.object.ts":
/*!*******************************************!*\
  !*** ../../core/objects/sprite.object.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpriteObject: () => (/* binding */ SpriteObject)
/* harmony export */ });
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var SpriteObject = /** @class */ (function (_super) {
    __extends(SpriteObject, _super);
    function SpriteObject(scene, config) {
        var _a;
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.hasCollision = false;
        _this.width = config.width;
        _this.height = config.height;
        _this.tileset = config.tileset;
        _this.spriteX = config.spriteX;
        _this.spriteY = config.spriteY;
        _this.renderLayer = (_a = config.renderLayer) !== null && _a !== void 0 ? _a : 0;
        return _this;
    }
    SpriteObject.prototype.render = function (context) {
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_1__.RenderUtils.renderSprite(context, this.assets.images['sprites'], this.spriteX, this.spriteY, this.positionX, this.positionY, this.width, this.height);
    };
    return SpriteObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__.SceneObject));



/***/ }),

/***/ "../../core/utils/math.utils.ts":
/*!**************************************!*\
  !*** ../../core/utils/math.utils.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MathUtils: () => (/* binding */ MathUtils)
/* harmony export */ });
var MathUtils = /** @class */ (function () {
    function MathUtils() {
    }
    // including min and max
    MathUtils.randomIntFromRange = function (min, max) {
        return Math.floor(this.randomNumberFromRange(min, max));
    };
    MathUtils.randomNumberFromRange = function (min, max) {
        return Math.random() * (max - min + 1) + min;
    };
    // for adding a bit of randomness to animation start times
    MathUtils.randomStartingDelta = function (seconds) {
        return Math.random() * (seconds !== null && seconds !== void 0 ? seconds : 1);
    };
    return MathUtils;
}());



/***/ }),

/***/ "../../core/utils/mouse.utils.ts":
/*!***************************************!*\
  !*** ../../core/utils/mouse.utils.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MouseUtils: () => (/* binding */ MouseUtils)
/* harmony export */ });
/* harmony import */ var _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/canvas.constants */ "../../core/constants/canvas.constants.ts");

var MouseUtils = /** @class */ (function () {
    function MouseUtils() {
    }
    /**
     * Gets the current mouse position relative to the canvas, taking into account fullscreen mode
     * Fullscreen mode adjusts the height if landscape, or width if portrait, of the canvas element, but not the pixel size of the canvas, so we need to adjust the mouse position accordingly
     * @param canvas
     * @param evt
     * @returns
     */
    MouseUtils.getMousePosition = function (canvas, event) {
        var boundingRect = canvas.getBoundingClientRect();
        var adjustedBountingRect = {
            height: boundingRect.height,
            width: boundingRect.width,
        };
        var adjustedEvent = {
            clientX: event.clientX,
            clientY: event.clientY,
        };
        // when canvas is in fullscreen mode, the canvas will be centered in the window, messing up the coordinates of the axis that isn't full width or height
        var ratio; // ratio of canvas element size to canvas pixel size
        if (canvas.width > canvas.height) {
            ratio = canvas.width / boundingRect.width; // ratio of canvas element size to canvas pixel size
            // adjust bounding rect
            adjustedBountingRect.height = canvas.height / ratio;
            // adjust click position
            var additionalHeight = (boundingRect.height - adjustedBountingRect.height);
            adjustedEvent.clientY -= (additionalHeight / 2);
        }
        else {
            ratio = canvas.height / boundingRect.height; // ratio of canvas element size to canvas pixel size
            // adjust bounding rect
            adjustedBountingRect.width = canvas.width / ratio;
            // adjust click position
            var additionalWidth = (boundingRect.width - adjustedBountingRect.width);
            adjustedEvent.clientX -= (additionalWidth / 2);
        }
        var scaleX = canvas.width / adjustedBountingRect.width;
        var scaleY = canvas.height / adjustedBountingRect.height;
        // scale mouse coordinates after they have been adjusted to be relative to element
        var x = ((adjustedEvent.clientX - boundingRect.left) * scaleX) / _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE;
        var y = ((adjustedEvent.clientY - boundingRect.top) * scaleY) / _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE;
        return {
            x: Math.floor(x),
            y: Math.floor(y),
            exactX: x,
            exactY: y,
        };
    };
    MouseUtils.setCursor = function (canvas, cursor) {
        canvas.style.cursor = "url(\"".concat(cursor, "\"), auto");
    };
    Object.defineProperty(MouseUtils, "isFullscreen", {
        get: function () {
            return document.fullscreenElement !== null;
        },
        enumerable: false,
        configurable: true
    });
    MouseUtils.isClickWithin = function (mousePosition, x, y, width, height) {
        return (mousePosition.exactX >= x &&
            mousePosition.exactX <= x + width &&
            mousePosition.exactY >= y &&
            mousePosition.exactY <= y + height);
    };
    return MouseUtils;
}());



/***/ }),

/***/ "../../core/utils/render.utils.ts":
/*!****************************************!*\
  !*** ../../core/utils/render.utils.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RenderUtils: () => (/* binding */ RenderUtils)
/* harmony export */ });
/* harmony import */ var _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/canvas.constants */ "../../core/constants/canvas.constants.ts");

var RenderUtils = /** @class */ (function () {
    function RenderUtils() {
    }
    RenderUtils.renderSprite = function (context, spriteSheet, spriteX, spriteY, positionX, positionY, spriteWidth, spriteHeight, options // TODO(smg): implement tile vs pixel
    ) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        var width = spriteWidth ? spriteWidth * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE : _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE;
        var height = spriteHeight ? spriteHeight * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE : _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE;
        var scale = (_a = options.scale) !== null && _a !== void 0 ? _a : 1; // use to scale the output
        var rotation = (_b = options.rotation) !== null && _b !== void 0 ? _b : 0; // degrees to rotate the sprite by
        // save the current context if we need to apply opacity, then restore it after
        // we don't do this for all renders as it is a performance hit
        var updateOpacity = (options.opacity && options.opacity < 1);
        var updateRotation = (rotation !== 0);
        var shouldSave = (updateOpacity || updateRotation);
        if (shouldSave) {
            context.save();
            if (updateOpacity) {
                context.globalAlpha = Math.max(0, options.opacity);
            }
            if (updateRotation) {
                // translate to the center of the sprite, rotate, then translate back
                var xTranslation = Math.floor((positionX + (spriteWidth / 2)) * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + 0.5;
                var yTranslation = Math.floor((positionY + (spriteHeight / 2)) * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + 0.5;
                context.translate(xTranslation, yTranslation);
                // TODO(smg): any angle that isn't 90, 180, 270, etc will cause blurring / weird sprite interoplation. This is a known issue with canvas and will need to see if this can be worked around
                context.rotate((rotation * Math.PI) / 180);
                context.translate(-xTranslation, -yTranslation);
            }
        }
        context.drawImage(spriteSheet, spriteX * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
        spriteY * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
        width, height, Math.floor(positionX * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
        Math.floor(positionY * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
        width * scale, height * scale);
        if (shouldSave) {
            context.restore();
        }
    };
    RenderUtils.renderSubsection = function (source, destination, startX, startY, endX, endY) {
        var startXPixel = Math.floor(startX * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE);
        var startYPixel = Math.floor(startY * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE);
        var endXPixel = Math.floor(endX * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE);
        var endYPixel = Math.floor(endY * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE);
        destination.drawImage(source.canvas, startXPixel, startYPixel, endXPixel - startXPixel, endYPixel - startYPixel, 0, 0, destination.canvas.width, destination.canvas.height);
    };
    RenderUtils.renderCircle = function (context, positionX, positionY, options) {
        if (options === void 0) { options = {}; }
        context.beginPath();
        context.arc((positionX * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + (_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE / 2), (positionY * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE) + (_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE / 2), _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE / 2, 0, 2 * Math.PI);
        context.stroke();
        context.fillStyle = options.colour || 'saddlebrown';
        context.fill();
    };
    // TODO(smg): this is using a mixture of pixel and tile coordinates, need to standardize
    RenderUtils.fillRectangle = function (context, positionX, positionY, width, height, options) {
        if (options === void 0) { options = {}; }
        context.strokeStyle = options.colour ? options.colour : 'black';
        context.fillStyle = options.colour ? options.colour : 'black';
        context.beginPath();
        context.rect(Math.floor(positionX * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE), // +0.5 to prevent blurring but that causes additional issues
        Math.floor(positionY * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE), // +0.5 to prevent blurring but that causes additional issues
        width, height);
        context.stroke();
        context.fill();
    };
    RenderUtils.strokeRectangle = function (context, positionX, positionY, width, height, colour) {
        context.strokeStyle = colour || 'black';
        // canvas renders on a half pixel so we need to offset by .5 in order to get the stroke width to be 1px, otherwise it was 2px wide https://stackoverflow.com/a/13879402
        context.lineWidth = 1;
        context.strokeRect(positionX + 0.5, positionY + 0.5, width - 1, height - 1);
    };
    RenderUtils.clearCanvas = function (context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    };
    RenderUtils.createCanvas = function (width, height) {
        // create canvas
        var canvas = document.createElement('canvas');
        // configure canvas
        canvas.width = width ? width * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE : _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_WIDTH;
        canvas.height = height ? height * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE : _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_HEIGHT;
        return canvas;
    };
    RenderUtils.getContext = function (canvas) {
        var context = canvas.getContext('2d');
        context.imageSmoothingEnabled = _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CONTEXT_IMAGE_SMOOTHING_ENABLED;
        return context;
    };
    RenderUtils.positionToPixelPosition = function (position) {
        return position * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE;
    };
    RenderUtils.renderText = function (context, text, positionX, positionY, options) {
        if (options === void 0) { options = {}; }
        var size = options.size ? options.size : 16;
        var colour = options.colour ? options.colour : 'black';
        context.font = "".concat(size, "px Helvetica");
        context.fillStyle = "".concat(colour);
        context.fillText(text, positionX * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
        positionY * _constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.TILE_SIZE // translate sprite position to pixel position
        );
    };
    RenderUtils.textToArray = function (text, width, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        // defaults
        var size = (_a = options.size) !== null && _a !== void 0 ? _a : 16;
        var colour = (_b = options.colour) !== null && _b !== void 0 ? _b : 'black';
        // configure context
        var context = document.createElement('canvas').getContext('2d');
        context.font = "".concat(size, "px Helvetica");
        context.fillStyle = "".concat(colour);
        // split words then create new line once exceeding width
        var words = text.split(' ');
        var currentLine = '';
        var output = [];
        for (var i = 0; i < words.length; i++) {
            var updatedLine = "".concat(currentLine, " ").concat(words[i]);
            // width exceeded, end line
            if (context.measureText(updatedLine).width >= width) {
                output.push(updatedLine);
                currentLine = '';
                continue;
            }
            // final word, end line
            if (words.length - 1 === i) {
                output.push(updatedLine);
                continue;
            }
            // no exit condition, store new line
            currentLine = updatedLine.trim();
        }
        return output;
    };
    return RenderUtils;
}());



/***/ }),

/***/ "./scenes/game/game.scene.ts":
/*!***********************************!*\
  !*** ./scenes/game/game.scene.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GAME_SCENE: () => (/* binding */ GAME_SCENE)
/* harmony export */ });
/* harmony import */ var _core_model_scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/model/scene */ "../../core/model/scene.ts");
/* harmony import */ var _maps_game_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./maps/game.map */ "./scenes/game/maps/game.map.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var GAME_SCENE = /** @class */ (function (_super) {
    __extends(GAME_SCENE, _super);
    function GAME_SCENE(client) {
        var _this = _super.call(this, client) || this;
        _this.client = client;
        _this.maps = [
            _maps_game_map__WEBPACK_IMPORTED_MODULE_1__.GAME_MAP
        ];
        _this.globals.score = 50;
        _this.globals.highscore = localStorage.getItem('highscore') === null ? 0 : Number(localStorage.getItem('highscore'));
        _this.changeMap(0);
        return _this;
    }
    return GAME_SCENE;
}(_core_model_scene__WEBPACK_IMPORTED_MODULE_0__.Scene));



/***/ }),

/***/ "./scenes/game/maps/game.map.ts":
/*!**************************************!*\
  !*** ./scenes/game/maps/game.map.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GAME_MAP: () => (/* binding */ GAME_MAP)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-map */ "../../core/model/scene-map.ts");
/* harmony import */ var _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/objects/sprite.object */ "../../core/objects/sprite.object.ts");
/* harmony import */ var _game_objects_player_object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game/objects/player.object */ "./scenes/game/maps/game/objects/player.object.ts");
/* harmony import */ var _game_objects_score_object__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./game/objects/score.object */ "./scenes/game/maps/game/objects/score.object.ts");
/* harmony import */ var _game_objects_floor_object__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./game/objects/floor.object */ "./scenes/game/maps/game/objects/floor.object.ts");
/* harmony import */ var _game_objects_controller_object__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./game/objects/controller.object */ "./scenes/game/maps/game/objects/controller.object.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







var MAP_HEIGHT = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT;
var MAP_WIDTH = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH;
var GAME_MAP = /** @class */ (function (_super) {
    __extends(GAME_MAP, _super);
    function GAME_MAP(scene) {
        var _this = _super.call(this, scene) || this;
        _this.scene = scene;
        _this.height = MAP_HEIGHT;
        _this.width = MAP_WIDTH;
        _this.backgroundLayers = [];
        _this.objects = [];
        // Sprite Background (as object)
        _this.objects.push(new _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_2__.SpriteObject(_this.scene, {
            positionX: 0,
            positionY: 0,
            width: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH,
            height: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT,
            tileset: 'sprites',
            spriteY: 0,
            spriteX: 0,
        }));
        // Player
        var player = new _game_objects_player_object__WEBPACK_IMPORTED_MODULE_3__.PlayerObject(_this.scene, {});
        _this.objects.push(player);
        _this.objects.push(new _game_objects_controller_object__WEBPACK_IMPORTED_MODULE_6__.ControllerObject(_this.scene, { player: player, }));
        _this.objects.push(new _game_objects_score_object__WEBPACK_IMPORTED_MODULE_4__.ScoreObject(_this.scene, {}));
        _this.objects.push(new _game_objects_floor_object__WEBPACK_IMPORTED_MODULE_5__.FloorObject(_this.scene, { player: player, }));
        return _this;
    }
    return GAME_MAP;
}(_core_model_scene_map__WEBPACK_IMPORTED_MODULE_1__.SceneMap));



/***/ }),

/***/ "./scenes/game/maps/game/constants/defaults.constants.ts":
/*!***************************************************************!*\
  !*** ./scenes/game/maps/game/constants/defaults.constants.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PIPE_GAP: () => (/* binding */ DEFAULT_PIPE_GAP),
/* harmony export */   DEFAULT_PIPE_REGION: () => (/* binding */ DEFAULT_PIPE_REGION),
/* harmony export */   DEFAULT_PIPE_SPEED: () => (/* binding */ DEFAULT_PIPE_SPEED),
/* harmony export */   DEFAULT_PLAYER_ACCELERATION: () => (/* binding */ DEFAULT_PLAYER_ACCELERATION),
/* harmony export */   DEFAULT_PLAYER_GRAVITY: () => (/* binding */ DEFAULT_PLAYER_GRAVITY),
/* harmony export */   DefaultsConstants: () => (/* binding */ DefaultsConstants)
/* harmony export */ });
var DEFAULT_PIPE_SPEED = 4;
var DEFAULT_PLAYER_GRAVITY = 48;
var DEFAULT_PLAYER_ACCELERATION = -12;
var DEFAULT_PIPE_GAP = 3; // gap between pipes
var DEFAULT_PIPE_REGION = 8; // only ever move within X tiles
var DefaultsConstants = /** @class */ (function () {
    function DefaultsConstants() {
    }
    DefaultsConstants.DEFAULT_PIPE_SPEED = DEFAULT_PIPE_SPEED;
    DefaultsConstants.DEFAULT_PLAYER_GRAVITY = DEFAULT_PLAYER_GRAVITY;
    DefaultsConstants.DEFAULT_PLAYER_ACCELERATION = DEFAULT_PLAYER_ACCELERATION;
    DefaultsConstants.DEFAULT_PIPE_GAP = DEFAULT_PIPE_GAP;
    DefaultsConstants.DEFAULT_PIPE_REGION = DEFAULT_PIPE_REGION;
    return DefaultsConstants;
}());



/***/ }),

/***/ "./scenes/game/maps/game/constants/events.constants.ts":
/*!*************************************************************!*\
  !*** ./scenes/game/maps/game/constants/events.constants.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameEvents: () => (/* binding */ GameEvents)
/* harmony export */ });
var GameEvents;
(function (GameEvents) {
    GameEvents["GameIdle"] = "GameIdle";
    GameEvents["GameStart"] = "GameStart";
    GameEvents["GameEnd"] = "GameEnd";
})(GameEvents || (GameEvents = {}));


/***/ }),

/***/ "./scenes/game/maps/game/constants/medal.constants.ts":
/*!************************************************************!*\
  !*** ./scenes/game/maps/game/constants/medal.constants.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BRONZE_MEDAL_THRESHOLD: () => (/* binding */ BRONZE_MEDAL_THRESHOLD),
/* harmony export */   GOLD_MEDAL_THRESHOLD: () => (/* binding */ GOLD_MEDAL_THRESHOLD),
/* harmony export */   PLATINUM_MEDAL_THRESHOLD: () => (/* binding */ PLATINUM_MEDAL_THRESHOLD),
/* harmony export */   SILVER_MEDAL_THRESHOLD: () => (/* binding */ SILVER_MEDAL_THRESHOLD)
/* harmony export */ });
var BRONZE_MEDAL_THRESHOLD = 10;
var SILVER_MEDAL_THRESHOLD = 20;
var GOLD_MEDAL_THRESHOLD = 30;
var PLATINUM_MEDAL_THRESHOLD = 40;


/***/ }),

/***/ "./scenes/game/maps/game/constants/sprite.constants.ts":
/*!*************************************************************!*\
  !*** ./scenes/game/maps/game/constants/sprite.constants.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NUMBER_SPRITES_LARGE: () => (/* binding */ NUMBER_SPRITES_LARGE),
/* harmony export */   NUMBER_SPRITES_MEDIUM: () => (/* binding */ NUMBER_SPRITES_MEDIUM)
/* harmony export */ });
var _a, _b;
var NUMBER_SPRITES_MEDIUM = (_a = {},
    _a['0'] = { spriteX: 8.5, spriteY: 19, },
    _a['1'] = { spriteX: 8.5625, spriteY: 29.6875, },
    _a['2'] = { spriteX: 8.5, spriteY: 30.4375, },
    _a['3'] = { spriteX: 8.125, spriteY: 31.1875, },
    _a['4'] = { spriteX: 31.375, spriteY: -0.125, },
    _a['5'] = { spriteX: 31.375, spriteY: 0.625, },
    _a['6'] = { spriteX: 31.5, spriteY: 1.5, },
    _a['7'] = { spriteX: 31.5, spriteY: 2.5, },
    _a['8'] = { spriteX: 18.25, spriteY: 15, },
    _a['9'] = { spriteX: 19.375, spriteY: 12.75, },
    _a);
var NUMBER_SPRITES_LARGE = (_b = {},
    _b['0'] = { spriteX: 30.875, spriteY: 3.75, },
    _b['1'] = { spriteX: 8.35, spriteY: 28.45, },
    _b['2'] = { spriteX: 18.125, spriteY: 10, },
    _b['3'] = { spriteX: 19, spriteY: 10, },
    _b['4'] = { spriteX: 19.875, spriteY: 10, },
    _b['5'] = { spriteX: 20.75, spriteY: 10, },
    _b['6'] = { spriteX: 18.125, spriteY: 11.5, },
    _b['7'] = { spriteX: 19, spriteY: 11.5, },
    _b['8'] = { spriteX: 19.875, spriteY: 11.5, },
    _b['9'] = { spriteX: 20.75, spriteY: 11.5, },
    _b);


/***/ }),

/***/ "./scenes/game/maps/game/objects/controller.object.ts":
/*!************************************************************!*\
  !*** ./scenes/game/maps/game/objects/controller.object.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ControllerObject: () => (/* binding */ ControllerObject)
/* harmony export */ });
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _constants_events_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/events.constants */ "./scenes/game/maps/game/constants/events.constants.ts");
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_objects_interval_object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @core/objects/interval.object */ "../../core/objects/interval.object.ts");
/* harmony import */ var _core_utils_math_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @core/utils/math.utils */ "../../core/utils/math.utils.ts");
/* harmony import */ var _pipe_object__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pipe.object */ "./scenes/game/maps/game/objects/pipe.object.ts");
/* harmony import */ var _point_object__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./point.object */ "./scenes/game/maps/game/objects/point.object.ts");
/* harmony import */ var _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @core/objects/sprite.object */ "../../core/objects/sprite.object.ts");
/* harmony import */ var _score_card_object__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./score-card.object */ "./scenes/game/maps/game/objects/score-card.object.ts");
/* harmony import */ var _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../constants/defaults.constants */ "./scenes/game/maps/game/constants/defaults.constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();










var ControllerObject = /** @class */ (function (_super) {
    __extends(ControllerObject, _super);
    function ControllerObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        // game end
        _this.continueTimer = 0;
        _this.continueDuration = 0.5; // seconds before can continue
        _this.player = config.player;
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_1__.GameEvents.GameIdle, _this.onGameIdle.bind(_this));
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_1__.GameEvents.GameStart, _this.onGameStart.bind(_this));
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_1__.GameEvents.GameEnd, _this.onGameEnd.bind(_this));
        _this.scene.dispatchEvent(_constants_events_constants__WEBPACK_IMPORTED_MODULE_1__.GameEvents.GameIdle);
        return _this;
    }
    ControllerObject.prototype.update = function (delta) {
        switch (this.state) {
            case 'idle':
                this.updateGameIdle();
                break;
            case 'game-over':
                this.updateGameEnd(delta);
                break;
        }
    };
    ControllerObject.prototype.onGameIdle = function () {
        if (this.state === 'idle') {
            return;
        }
        this.cleanupGameEnd();
        this.state = 'idle';
        this.scene.globals.score = 0;
        // values here are awkwardly hardcoded
        var spriteWidth = 3.675;
        var spriteHeight = 3.5;
        this.idleSprite = new _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_7__.SpriteObject(this.scene, {
            positionX: (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_WIDTH / 2) - (spriteWidth / 2) + 0.05,
            positionY: (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_HEIGHT / 2) - 0.8,
            width: spriteWidth,
            height: spriteHeight,
            tileset: 'sprites',
            spriteX: 18.25,
            spriteY: 5.25,
            renderLayer: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.UI_COLLISION_LAYER,
        });
        this.scene.addObject(this.idleSprite);
    };
    ControllerObject.prototype.onGameStart = function () {
        var _this = this;
        if (this.state === 'playing') {
            return;
        }
        this.state = 'playing';
        if (this.idleSprite) {
            this.scene.removeObjectById(this.idleSprite.id);
        }
        this.interval = new _core_objects_interval_object__WEBPACK_IMPORTED_MODULE_3__.IntervalObject(this.scene, {
            duration: 2,
            onInterval: function () {
                var region = _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_9__.DEFAULT_PIPE_REGION;
                var gap = _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_9__.DefaultsConstants.DEFAULT_PIPE_GAP;
                var min = (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (region / 2);
                var max = min + (region / 2);
                var height = _core_utils_math_utils__WEBPACK_IMPORTED_MODULE_4__.MathUtils.randomNumberFromRange(min, max);
                // Pipes
                _this.scene.addObject(new _pipe_object__WEBPACK_IMPORTED_MODULE_5__.PipeObject(_this.scene, {
                    player: _this.player,
                    type: 'top',
                    height: height,
                }));
                _this.scene.addObject(new _pipe_object__WEBPACK_IMPORTED_MODULE_5__.PipeObject(_this.scene, {
                    player: _this.player,
                    type: 'bottom',
                    height: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_HEIGHT - height - gap,
                }));
                // point
                _this.scene.addObject(new _point_object__WEBPACK_IMPORTED_MODULE_6__.PointObject(_this.scene, {
                    player: _this.player,
                }));
            },
        });
        this.scene.addObject(this.interval);
    };
    ControllerObject.prototype.onGameEnd = function () {
        if (this.state === 'game-over') {
            return;
        }
        this.state = 'game-over';
        // TODO(smg): move cleanup of previous state to it's own function
        if (this.interval) {
            this.scene.removeObjectById(this.interval.id);
        }
        // scorecard
        this.scorecard = new _score_card_object__WEBPACK_IMPORTED_MODULE_8__.ScoreCardObject(this.scene, {});
        this.scene.addObject(this.scorecard);
        // set highscore
        if (this.scene.globals.score > this.scene.globals.highscore) {
            this.scene.globals.highscore = this.scene.globals.score;
            localStorage.setItem('highscore', this.scene.globals.score.toString());
        }
        this.continueTimer = 0;
    };
    ControllerObject.prototype.cleanupGameEnd = function () {
        if (this.scorecard) {
            this.scene.removeObjectById(this.scorecard.id);
        }
    };
    ControllerObject.prototype.updateGameEnd = function (delta) {
        this.continueTimer += delta;
        console.log(this.continueTimer);
        if (this.continueTimer < this.continueDuration) {
            return;
        }
        if (!this.scene.globals.keyboard[' '] && !this.scene.globals.mouse.click.left) {
            return;
        }
        this.scene.globals.keyboard[' '] = false;
        this.scene.globals.mouse.click.left = false;
        this.scene.dispatchEvent(_constants_events_constants__WEBPACK_IMPORTED_MODULE_1__.GameEvents.GameIdle);
    };
    ControllerObject.prototype.updateGameIdle = function () {
        if (!this.scene.globals.keyboard[' '] && !this.scene.globals.mouse.click.left) {
            return;
        }
        this.scene.globals.keyboard[' '] = false;
        this.scene.globals.mouse.click.left = false;
        this.scene.dispatchEvent(_constants_events_constants__WEBPACK_IMPORTED_MODULE_1__.GameEvents.GameStart);
    };
    return ControllerObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__.SceneObject));



/***/ }),

/***/ "./scenes/game/maps/game/objects/floor.object.ts":
/*!*******************************************************!*\
  !*** ./scenes/game/maps/game/objects/floor.object.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FloorObject: () => (/* binding */ FloorObject)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
/* harmony import */ var _constants_events_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/events.constants */ "./scenes/game/maps/game/constants/events.constants.ts");
/* harmony import */ var _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/defaults.constants */ "./scenes/game/maps/game/constants/defaults.constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var DEFAULT_RENDER_LAYER = 10;
var SEGMENT_WIDTH = 2.25; // width of the floor segment
var FloorObject = /** @class */ (function (_super) {
    __extends(FloorObject, _super);
    function FloorObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.renderLayer = DEFAULT_RENDER_LAYER;
        _this.offset = 0;
        _this.checkCollision = true;
        _this.movingFloor = false;
        // config
        _this.player = config.player;
        // setup
        _this.height = 2;
        _this.width = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH;
        _this.positionX = 0;
        _this.positionY = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT - _this.height;
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_3__.GameEvents.GameStart, _this.onGameStart.bind(_this));
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_3__.GameEvents.GameEnd, _this.onGameOver.bind(_this));
        return _this;
    }
    FloorObject.prototype.update = function (delta) {
        if (this.checkCollision) {
            this.updateCheckIfPlayerAboveGround(delta);
        }
        if (this.movingFloor) {
            this.offset += delta * _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PIPE_SPEED;
            this.offset %= SEGMENT_WIDTH;
        }
    };
    FloorObject.prototype.render = function (context) {
        this.renderFloor(context);
    };
    FloorObject.prototype.updateCheckIfPlayerAboveGround = function (delta) {
        if (this.player.positionY + this.player.height < this.positionY) {
            return;
        }
        this.scene.dispatchEvent(_constants_events_constants__WEBPACK_IMPORTED_MODULE_3__.GameEvents.GameEnd);
    };
    FloorObject.prototype.renderFloor = function (context) {
        for (var i = 0; i < _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH + SEGMENT_WIDTH; i += SEGMENT_WIDTH) {
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__.RenderUtils.renderSprite(context, this.assets.images.sprites, 19, 0, this.positionX + i - this.offset, this.positionY, SEGMENT_WIDTH, this.height);
        }
    };
    FloorObject.prototype.onGameStart = function () {
        this.checkCollision = true;
        this.movingFloor = true;
    };
    FloorObject.prototype.onGameOver = function () {
        this.checkCollision = false;
        this.movingFloor = false;
    };
    return FloorObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__.SceneObject));



/***/ }),

/***/ "./scenes/game/maps/game/objects/pipe.object.ts":
/*!******************************************************!*\
  !*** ./scenes/game/maps/game/objects/pipe.object.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PipeObject: () => (/* binding */ PipeObject)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
/* harmony import */ var _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/defaults.constants */ "./scenes/game/maps/game/constants/defaults.constants.ts");
/* harmony import */ var _constants_events_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/events.constants */ "./scenes/game/maps/game/constants/events.constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var SPRITES = {
    TopExit: {
        width: 1.625,
        height: 0.8125,
        tileset: 'sprites',
        spriteX: 5.25,
        spriteY: 20.1875,
    },
    Pipe: {
        width: 1.625,
        height: 0.8125,
        tileset: 'sprites',
        spriteX: 5.25,
        spriteY: 29.375,
    },
    BottomExit: {
        width: 1.625,
        height: 0.8125,
        tileset: 'sprites',
        spriteX: 3.5,
        spriteY: 29.375,
    },
};
var PipeObject = /** @class */ (function (_super) {
    __extends(PipeObject, _super);
    function PipeObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.width = 1.625;
        _this.canMove = true;
        _this.player = config.player;
        _this.type = config.type;
        _this.height = config.height;
        _this.positionY = _this.type === 'top' ? 0 : _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT - _this.height;
        _this.positionX = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH + 1;
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_4__.GameEvents.GameIdle, _this.onGameIdle.bind(_this));
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_4__.GameEvents.GameEnd, _this.onGameEnd.bind(_this));
        return _this;
    }
    PipeObject.prototype.update = function (delta) {
        if (this.canMove) {
            this.updatePosition(delta);
            this.updateCollidingWithPlayer(delta);
        }
    };
    PipeObject.prototype.render = function (context) {
        switch (this.type) {
            case 'top':
                this.renderTopPipe(context);
                break;
            case 'bottom':
                this.renderBottomPipe(context);
                break;
        }
    };
    PipeObject.prototype.updatePosition = function (delta) {
        // move from left of screen to the right
        this.positionX -= (_constants_defaults_constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_PIPE_SPEED * delta);
        // when off screen, remove pipe
        if (this.positionX < -3) {
            this.scene.removeObject(this);
        }
    };
    PipeObject.prototype.updateCollidingWithPlayer = function (delta) {
        // if player collides with pipe
        if (this.isCollidingWith(this.player)) {
            this.scene.dispatchEvent(_constants_events_constants__WEBPACK_IMPORTED_MODULE_4__.GameEvents.GameEnd);
        }
        // if player is off top of screen passes over pipe
        if (this.player.positionY < 0 && this.isWithinHorizontalBounds(this.player)) {
            this.scene.dispatchEvent(_constants_events_constants__WEBPACK_IMPORTED_MODULE_4__.GameEvents.GameEnd);
        }
    };
    PipeObject.prototype.renderTopPipe = function (context) {
        // repeat pipe until off screen
        for (var i = this.height - SPRITES.BottomExit.height; i >= -3; i -= SPRITES.Pipe.height) {
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__.RenderUtils.renderSprite(context, this.assets.images['sprites'], SPRITES.Pipe.spriteX, SPRITES.Pipe.spriteY, this.positionX, this.positionY + i, SPRITES.Pipe.width, SPRITES.Pipe.height);
        }
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__.RenderUtils.renderSprite(context, this.assets.images['sprites'], SPRITES.BottomExit.spriteX, SPRITES.BottomExit.spriteY, this.positionX, this.positionY + this.height - SPRITES.BottomExit.height, SPRITES.BottomExit.width, SPRITES.BottomExit.height);
    };
    PipeObject.prototype.renderBottomPipe = function (context) {
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__.RenderUtils.renderSprite(context, this.assets.images['sprites'], SPRITES.TopExit.spriteX, SPRITES.TopExit.spriteY, this.positionX, this.positionY, SPRITES.TopExit.width, SPRITES.TopExit.height);
        // repeat pipe until off screen
        for (var i = SPRITES.TopExit.height; i < this.height; i += SPRITES.Pipe.height) {
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__.RenderUtils.renderSprite(context, this.assets.images['sprites'], SPRITES.Pipe.spriteX, SPRITES.Pipe.spriteY, this.positionX, this.positionY + i, SPRITES.Pipe.width, SPRITES.Pipe.height);
        }
    };
    PipeObject.prototype.onGameIdle = function () {
        this.scene.removeObjectById(this.id);
    };
    PipeObject.prototype.onGameEnd = function () {
        this.canMove = false;
    };
    return PipeObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__.SceneObject));



/***/ }),

/***/ "./scenes/game/maps/game/objects/player.object.ts":
/*!********************************************************!*\
  !*** ./scenes/game/maps/game/objects/player.object.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayerObject: () => (/* binding */ PlayerObject)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_model_sprite_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/model/sprite-animation */ "../../core/model/sprite-animation.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
/* harmony import */ var _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/defaults.constants */ "./scenes/game/maps/game/constants/defaults.constants.ts");
/* harmony import */ var _constants_events_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/events.constants */ "./scenes/game/maps/game/constants/events.constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var DEFAULT_ANIMATIONS = {
    default: new _core_model_sprite_animation__WEBPACK_IMPORTED_MODULE_2__.SpriteAnimation('sprites', [
        { spriteX: 0.1875, spriteY: 30.6875, duration: 0.0625, }, // 0
        { spriteX: 1.9375, spriteY: 30.6875, duration: 0.0625, }, // 1
        { spriteX: 3.6875, spriteY: 30.6875, duration: 0.0625, }, // 2
        { spriteX: 1.9375, spriteY: 30.6875, duration: 0.0625, } // 1
    ]),
};
var DEFAULT_RENDER_LAYER = 12;
var PlayerObject = /** @class */ (function (_super) {
    __extends(PlayerObject, _super);
    function PlayerObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.renderLayer = DEFAULT_RENDER_LAYER;
        _this.width = 1.0625; // 17px
        _this.height = 0.75; // 12px
        // movement
        _this.speed = 0;
        // animations
        _this.animationEnabled = true;
        _this.animation = {
            index: 0,
            timer: 0,
        };
        _this.positionX = _this.startingX;
        _this.positionY = _this.startingY;
        _this.animations = DEFAULT_ANIMATIONS;
        _this.state = 'playing';
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_5__.GameEvents.GameIdle, _this.onGameIdle.bind(_this));
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_5__.GameEvents.GameStart, _this.onGameStart.bind(_this));
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_5__.GameEvents.GameEnd, _this.onGameOver.bind(_this));
        return _this;
    }
    PlayerObject.prototype.update = function (delta) {
        switch (this.state) {
            case 'idle':
                // this.updatePlaying(delta);
                break;
            case 'playing':
                this.updatePlaying(delta);
                break;
            case 'game-over':
                this.updateGameOver(delta);
                break;
        }
    };
    PlayerObject.prototype.updatePlaying = function (delta) {
        this.updateGravity(delta);
        this.updateFlap(delta);
        this.positionY += (this.speed * delta);
        this.updateAnimationTimer(delta);
    };
    PlayerObject.prototype.updateGameOver = function (delta) {
        // fall towards ground if not at ground
        if (this.positionY > _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT - 3) {
            return;
        }
        this.speed += (_constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PLAYER_GRAVITY * delta);
        this.positionY += (this.speed * delta);
    };
    PlayerObject.prototype.render = function (context) {
        this.renderPlayer(context);
    };
    PlayerObject.prototype.updateGravity = function (delta) {
        this.speed += (_constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PLAYER_GRAVITY * delta);
    };
    PlayerObject.prototype.updateFlap = function (delta) {
        if (!this.scene.globals.mouse.click.left && !this.scene.globals.keyboard[' ']) {
            return;
        }
        this.scene.globals.mouse.click.left = false;
        this.scene.globals.keyboard[' '] = false;
        // if falling, reset speed to 0
        if (this.speed > 0) {
            this.speed = 0;
        }
        this.speed += _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PLAYER_ACCELERATION;
    };
    PlayerObject.prototype.updateAnimationTimer = function (delta) {
        if (!this.animationEnabled) {
            return;
        }
        this.animation.timer = (this.animation.timer + delta) % this.animations['default'].duration;
    };
    PlayerObject.prototype.renderPlayer = function (context) {
        var animation = this.animations['default'];
        var frame = animation.currentFrame(this.animation.timer);
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_3__.RenderUtils.renderSprite(context, this.assets.images[animation.tileset], frame.spriteX, frame.spriteY, this.positionX, this.positionY, this.width, this.height);
    };
    PlayerObject.prototype.onGameIdle = function () {
        this.state = 'idle';
        this.positionX = this.startingX;
        this.positionY = this.startingY;
        this.speed = 0;
    };
    PlayerObject.prototype.onGameStart = function () {
        // start with player moving upwards
        this.speed = _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_PLAYER_ACCELERATION;
        this.state = 'playing';
    };
    PlayerObject.prototype.onGameOver = function () {
        this.state = 'game-over';
    };
    Object.defineProperty(PlayerObject.prototype, "startingX", {
        get: function () {
            return (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH / 2) - (this.width / 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlayerObject.prototype, "startingY", {
        get: function () {
            return (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (this.height / 2);
        },
        enumerable: false,
        configurable: true
    });
    return PlayerObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__.SceneObject));



/***/ }),

/***/ "./scenes/game/maps/game/objects/point.object.ts":
/*!*******************************************************!*\
  !*** ./scenes/game/maps/game/objects/point.object.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PointObject: () => (/* binding */ PointObject)
/* harmony export */ });
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _constants_events_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/events.constants */ "./scenes/game/maps/game/constants/events.constants.ts");
/* harmony import */ var _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/defaults.constants */ "./scenes/game/maps/game/constants/defaults.constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var PointObject = /** @class */ (function (_super) {
    __extends(PointObject, _super);
    function PointObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.width = 0.0625;
        _this.height = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.CANVAS_TILE_HEIGHT;
        _this.player = config.player;
        _this.positionX = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.CANVAS_TILE_WIDTH + 2.625;
        _this.scene.addEventListener(_constants_events_constants__WEBPACK_IMPORTED_MODULE_2__.GameEvents.GameEnd, _this.onGameOver.bind(_this));
        return _this;
    }
    PointObject.prototype.update = function (delta) {
        this.updatePosition(delta);
        this.updatePoints(delta);
    };
    PointObject.prototype.render = function (context) {
    };
    PointObject.prototype.updatePosition = function (delta) {
        // move from left of screen to the right
        this.positionX -= (_constants_defaults_constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_PIPE_SPEED * delta);
        // when off screen, remove pipe
        if (this.positionX < -3) { // 3 is arbitrary here, could be a better value
            this.scene.removeObject(this);
        }
    };
    PointObject.prototype.updatePoints = function (delta) {
        if (this.positionX < this.player.positionX) {
            this.scene.globals.score++;
            this.scene.removeObject(this);
        }
    };
    PointObject.prototype.onGameOver = function () {
        this.scene.removeObjectById(this.id);
    };
    return PointObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_0__.SceneObject));



/***/ }),

/***/ "./scenes/game/maps/game/objects/score-card.object.ts":
/*!************************************************************!*\
  !*** ./scenes/game/maps/game/objects/score-card.object.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScoreCardObject: () => (/* binding */ ScoreCardObject)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/objects/sprite.object */ "../../core/objects/sprite.object.ts");
/* harmony import */ var _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/sprite.constants */ "./scenes/game/maps/game/constants/sprite.constants.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
/* harmony import */ var _constants_medal_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/medal.constants */ "./scenes/game/maps/game/constants/medal.constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var MEDAL_SPRITES = {
    bronze: { spriteX: 7, spriteY: 29.75, },
    silver: { spriteX: 7, spriteY: 28.25, },
    gold: { spriteX: 7.5, spriteY: 17.5, },
    platinum: { spriteX: 7.5, spriteY: 16, },
};
var ScoreCardObject = /** @class */ (function (_super) {
    __extends(ScoreCardObject, _super);
    function ScoreCardObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.renderLayer = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.UI_COLLISION_LAYER;
        // background
        _this.background = _this.createBackground();
        _this.scene.addObject(_this.background);
        // medal
        if (_this.medalType !== 'none') {
            _this.medal = _this.createMedal(_this.medalType);
            _this.scene.addObject(_this.medal);
        }
        return _this;
    }
    ScoreCardObject.prototype.render = function (context) {
        this.renderScore(context);
        this.renderScoreHighscore(context);
    };
    ScoreCardObject.prototype.createBackground = function () {
        var spriteWidth = 7.5;
        var spriteHeight = 4;
        return new _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_2__.SpriteObject(this.scene, {
            positionX: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_CENTER_TILE_X - (spriteWidth / 2),
            positionY: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_CENTER_TILE_Y - (spriteHeight / 2),
            width: spriteWidth,
            height: spriteHeight,
            tileset: 'sprites',
            spriteX: 0,
            spriteY: 16,
            renderLayer: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.UI_COLLISION_LAYER,
        });
    };
    ScoreCardObject.prototype.createMedal = function (medal) {
        var spriteWidth = 1.5;
        var spriteHeight = 1.5;
        if (medal === 'none') {
            return;
        }
        return new _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_2__.SpriteObject(this.scene, {
            positionX: this.background.positionX + 1,
            positionY: this.background.positionY + 1.375,
            width: spriteWidth,
            height: spriteHeight,
            tileset: 'sprites',
            spriteX: MEDAL_SPRITES[medal].spriteX,
            spriteY: MEDAL_SPRITES[medal].spriteY,
            renderLayer: _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.UI_COLLISION_LAYER,
        });
    };
    ScoreCardObject.prototype.renderScore = function (context) {
        var _this = this;
        var score = this.scene.globals.score.toString().split('');
        var positionX = this.background.positionX + this.background.width - 1.5;
        var positionY = this.background.positionY + 1.125;
        var spriteWidth = 0.5;
        var xOffset = 0.0625;
        var spriteHeight = 0.75;
        var start = (score.length - 1) * (spriteWidth + xOffset);
        score.forEach(function (digit, index) {
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_4__.RenderUtils.renderSprite(context, _this.assets.images.sprites, _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__.NUMBER_SPRITES_MEDIUM[digit].spriteX, _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__.NUMBER_SPRITES_MEDIUM[digit].spriteY, (positionX - start) + ((spriteWidth + xOffset) * index), positionY, spriteWidth, spriteHeight);
        });
    };
    ScoreCardObject.prototype.renderScoreHighscore = function (context) {
        var _this = this;
        var score = this.scene.globals.highscore.toString().split('');
        var positionX = this.background.positionX + this.background.width - 1.5;
        var positionY = this.background.positionY + 1.125;
        var spriteWidth = 0.5;
        var xOffset = 0.0625;
        var spriteHeight = 0.75;
        var start = (score.length - 1) * (spriteWidth + xOffset);
        score.forEach(function (digit, index) {
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_4__.RenderUtils.renderSprite(context, _this.assets.images.sprites, _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__.NUMBER_SPRITES_MEDIUM[digit].spriteX, _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__.NUMBER_SPRITES_MEDIUM[digit].spriteY, (positionX - start) + ((spriteWidth + xOffset) * index), positionY + 1.5, spriteWidth, spriteHeight);
        });
    };
    Object.defineProperty(ScoreCardObject.prototype, "medalType", {
        get: function () {
            if (this.scene.globals.score >= _constants_medal_constants__WEBPACK_IMPORTED_MODULE_5__.PLATINUM_MEDAL_THRESHOLD) {
                return 'platinum';
            }
            if (this.scene.globals.score >= _constants_medal_constants__WEBPACK_IMPORTED_MODULE_5__.GOLD_MEDAL_THRESHOLD) {
                return 'gold';
            }
            if (this.scene.globals.score >= _constants_medal_constants__WEBPACK_IMPORTED_MODULE_5__.SILVER_MEDAL_THRESHOLD) {
                return 'silver';
            }
            if (this.scene.globals.score >= _constants_medal_constants__WEBPACK_IMPORTED_MODULE_5__.BRONZE_MEDAL_THRESHOLD) {
                return 'bronze';
            }
            return 'none';
        },
        enumerable: false,
        configurable: true
    });
    ScoreCardObject.prototype.destroy = function () {
        this.scene.removeObjectById(this.background.id);
        if (this.medal) {
            this.scene.removeObjectById(this.medal.id);
        }
    };
    return ScoreCardObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__.SceneObject));



/***/ }),

/***/ "./scenes/game/maps/game/objects/score.object.ts":
/*!*******************************************************!*\
  !*** ./scenes/game/maps/game/objects/score.object.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScoreObject: () => (/* binding */ ScoreObject)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
/* harmony import */ var _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/sprite.constants */ "./scenes/game/maps/game/constants/sprite.constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var ScoreObject = /** @class */ (function (_super) {
    __extends(ScoreObject, _super);
    function ScoreObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.renderLayer = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.UI_COLLISION_LAYER;
        return _this;
    }
    ScoreObject.prototype.render = function (context) {
        var _this = this;
        var score = this.scene.globals.score.toString().split('');
        score.forEach(function (digit, index) {
            var offset = digit === '1' ? 0.16 : 0; // the 1 sprite in the sheet is a bit off so manually adjusting it rather than altering the sprite sheet
            _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_2__.RenderUtils.renderSprite(context, _this.assets.images.sprites, _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__.NUMBER_SPRITES_LARGE[digit].spriteX, _constants_sprite_constants__WEBPACK_IMPORTED_MODULE_3__.NUMBER_SPRITES_LARGE[digit].spriteY, (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH / 2) - (score.length / 2) + index + offset, _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT / 8, undefined, 1.125);
        });
    };
    return ScoreObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__.SceneObject));



/***/ }),

/***/ "./scenes/main-menu/main-menu.scene.ts":
/*!*********************************************!*\
  !*** ./scenes/main-menu/main-menu.scene.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAIN_MENU_SCENE: () => (/* binding */ MAIN_MENU_SCENE)
/* harmony export */ });
/* harmony import */ var _core_model_scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/model/scene */ "../../core/model/scene.ts");
/* harmony import */ var _maps_main_menu_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./maps/main-menu.map */ "./scenes/main-menu/maps/main-menu.map.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var MAIN_MENU_SCENE = /** @class */ (function (_super) {
    __extends(MAIN_MENU_SCENE, _super);
    function MAIN_MENU_SCENE(client) {
        var _this = _super.call(this, client) || this;
        _this.client = client;
        _this.maps = [
            _maps_main_menu_map__WEBPACK_IMPORTED_MODULE_1__.MAIN_MENU_MAP
        ];
        _this.changeMap(0);
        return _this;
    }
    return MAIN_MENU_SCENE;
}(_core_model_scene__WEBPACK_IMPORTED_MODULE_0__.Scene));



/***/ }),

/***/ "./scenes/main-menu/maps/main-menu.map.ts":
/*!************************************************!*\
  !*** ./scenes/main-menu/maps/main-menu.map.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAIN_MENU_MAP: () => (/* binding */ MAIN_MENU_MAP)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-map */ "../../core/model/scene-map.ts");
/* harmony import */ var _main_menu_backgrounds_layer_1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./main-menu/backgrounds/layer.1 */ "./scenes/main-menu/maps/main-menu/backgrounds/layer.1.ts");
/* harmony import */ var _main_menu_objects_start_button_object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./main-menu/objects/start-button.object */ "./scenes/main-menu/maps/main-menu/objects/start-button.object.ts");
/* harmony import */ var _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @core/objects/sprite.object */ "../../core/objects/sprite.object.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var MAP_HEIGHT = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT;
var MAP_WIDTH = _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH;
var MAIN_MENU_MAP = /** @class */ (function (_super) {
    __extends(MAIN_MENU_MAP, _super);
    function MAIN_MENU_MAP(scene) {
        var _this = _super.call(this, scene) || this;
        _this.scene = scene;
        _this.height = MAP_HEIGHT;
        _this.width = MAP_WIDTH;
        _this.backgroundLayers = [
            _main_menu_backgrounds_layer_1__WEBPACK_IMPORTED_MODULE_2__.MAIN_MENU_BACKGROUND_LAYER_1
        ];
        _this.objects = [];
        _this.objects.push(new _main_menu_objects_start_button_object__WEBPACK_IMPORTED_MODULE_3__.StartButtonObject(_this.scene, {}));
        // logo
        var logoWidth = 6;
        var logoHeight = 1.8;
        _this.objects.push(new _core_objects_sprite_object__WEBPACK_IMPORTED_MODULE_4__.SpriteObject(_this.scene, {
            positionX: (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH / 2) - (logoWidth / 2),
            positionY: 3,
            width: logoWidth,
            height: logoHeight,
            tileset: 'sprites',
            spriteX: 21.75,
            spriteY: 5.5,
        }));
        return _this;
    }
    return MAIN_MENU_MAP;
}(_core_model_scene_map__WEBPACK_IMPORTED_MODULE_1__.SceneMap));



/***/ }),

/***/ "./scenes/main-menu/maps/main-menu/backgrounds/layer.1.ts":
/*!****************************************************************!*\
  !*** ./scenes/main-menu/maps/main-menu/backgrounds/layer.1.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAIN_MENU_BACKGROUND_LAYER_1: () => (/* binding */ MAIN_MENU_BACKGROUND_LAYER_1)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var BASE_TILE = {
    tileset: 'sprites',
    animationFrameDuration: 1,
    animationFrames: [],
    animationMap: [1],
};
var SKY = __assign(__assign({}, BASE_TILE), { animationFrames: [
        { spriteX: 0, spriteY: 0, }
    ] });
var CITY_TRANSITION = __assign(__assign({}, BASE_TILE), { animationFrames: [
        { spriteX: 0, spriteY: 9, }
    ] });
var CITY = __assign(__assign({}, BASE_TILE), { animationFrames: [
        { spriteX: 0, spriteY: 10, }
    ] });
var GRASS_TRANSITION = __assign(__assign({}, BASE_TILE), { animationFrames: [
        { spriteX: 0, spriteY: 11, }
    ] });
var GRASS = __assign(__assign({}, BASE_TILE), { animationFrames: [
        { spriteX: 0, spriteY: 15, }
    ] });
var COLUMN = [
    SKY,
    SKY,
    SKY,
    SKY,
    SKY,
    SKY,
    SKY,
    SKY,
    SKY,
    SKY,
    CITY_TRANSITION,
    CITY,
    GRASS_TRANSITION,
    GRASS,
    GRASS,
    GRASS
];
// TODO(smg): background is 9 tiles wide
var MAIN_MENU_BACKGROUND_LAYER_1 = {
    index: 0,
    tiles: [
        COLUMN,
        COLUMN,
        COLUMN,
        COLUMN,
        COLUMN,
        COLUMN,
        COLUMN,
        COLUMN,
        COLUMN,
        COLUMN
    ],
};


/***/ }),

/***/ "./scenes/main-menu/maps/main-menu/objects/start-button.object.ts":
/*!************************************************************************!*\
  !*** ./scenes/main-menu/maps/main-menu/objects/start-button.object.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StartButtonObject: () => (/* binding */ StartButtonObject)
/* harmony export */ });
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core/model/scene-object */ "../../core/model/scene-object.ts");
/* harmony import */ var _core_utils_mouse_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/utils/mouse.utils */ "../../core/utils/mouse.utils.ts");
/* harmony import */ var _flappy_bird_scenes_game_game_scene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @flappy-bird/scenes/game/game.scene */ "./scenes/game/game.scene.ts");
/* harmony import */ var _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @core/utils/render.utils */ "../../core/utils/render.utils.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var StartButtonObject = /** @class */ (function (_super) {
    __extends(StartButtonObject, _super);
    function StartButtonObject(scene, config) {
        var _this = _super.call(this, scene, config) || this;
        _this.scene = scene;
        _this.isRenderable = true;
        _this.width = 3.5;
        _this.height = 2;
        _this.positionX = (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_WIDTH / 2) - (_this.width / 2);
        _this.positionY = (_core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (_this.height / 2);
        return _this;
    }
    StartButtonObject.prototype.update = function (delta) {
        if (!this.scene.globals.mouse.click.left) {
            return;
        }
        this.scene.globals.mouse.click.left = false;
        var clicked = _core_utils_mouse_utils__WEBPACK_IMPORTED_MODULE_2__.MouseUtils.isClickWithin(this.scene.globals.mouse.position, this.positionX, this.positionY, this.width, this.height);
        if (!clicked) {
            return;
        }
        this.scene.changeScene(_flappy_bird_scenes_game_game_scene__WEBPACK_IMPORTED_MODULE_3__.GAME_SCENE);
    };
    StartButtonObject.prototype.render = function (context) {
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_4__.RenderUtils.renderSprite(context, this.assets.images['sprites'], 22, 7.25, this.positionX, this.positionY, this.width, this.height);
    };
    return StartButtonObject;
}(_core_model_scene_object__WEBPACK_IMPORTED_MODULE_1__.SceneObject));



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @core/client */ "../../core/client.ts");
/* harmony import */ var _scenes_main_menu_main_menu_scene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scenes/main-menu/main-menu.scene */ "./scenes/main-menu/main-menu.scene.ts");
/* harmony import */ var _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/constants/canvas.constants */ "../../core/constants/canvas.constants.ts");
/* harmony import */ var _scenes_game_game_scene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scenes/game/game.scene */ "./scenes/game/game.scene.ts");
/* harmony import */ var _scenes_game_maps_game_constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scenes/game/maps/game/constants/defaults.constants */ "./scenes/game/maps/game/constants/defaults.constants.ts");





(function () {
    /**
     * Declare your canvas constants here
     */
    _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_HEIGHT = 16;
    _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_WIDTH = 9;
    _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.TILE_SIZE = 16;
    // cheat codes
    var params = new URLSearchParams(window.location.search);
    var cheatcode = params.get('cheatcode');
    var cheatcodeValue = params.get('cheatcodevalue');
    if (cheatcode === 'joanne' && cheatcodeValue !== null && !isNaN(Number(cheatcodeValue))) {
        _scenes_game_maps_game_constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__.DefaultsConstants.DEFAULT_PIPE_GAP = Number(cheatcodeValue);
        console.log('cheat code activated for pipe gap: ' + _scenes_game_maps_game_constants_defaults_constants__WEBPACK_IMPORTED_MODULE_4__.DefaultsConstants.DEFAULT_PIPE_GAP);
    }
    /**
    * Add your scenes here, the first scene will be loaded on startup
    */
    var scenes = [
        _scenes_main_menu_main_menu_scene__WEBPACK_IMPORTED_MODULE_1__.MAIN_MENU_SCENE,
        _scenes_game_game_scene__WEBPACK_IMPORTED_MODULE_3__.GAME_SCENE
    ];
    var assets = {
        images: {
            sprites: 'assets/sprites.png',
        },
        audio: {},
    };
    window.engine = new _core_client__WEBPACK_IMPORTED_MODULE_0__.Client(document.getElementById('render-area'), scenes, assets);
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBK0Q7QUFFWjtBQUduRDtJQXNERSxnQkFDUyxTQUFzQixFQUM3QixNQUFtQyxFQUNuQyxNQUFvQjtRQUh0QixpQkFzREM7UUFyRFEsY0FBUyxHQUFULFNBQVMsQ0FBYTtRQXREL0IsWUFBWTtRQUNLLGtCQUFhLEdBQVcsd0VBQWUsQ0FBQyxhQUFhLENBQUM7UUFDdEQsaUJBQVksR0FBVyx3RUFBZSxDQUFDLFlBQVksQ0FBQztRQUs5RCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLHdCQUFtQixHQUFXLENBQUMsQ0FBQztRQU14QyxTQUFTO1FBQ1QsV0FBTSxHQUFXO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixLQUFLLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFFRixRQUFRO1FBQ1IsVUFBSyxHQUFHO1lBQ04sT0FBTyxFQUFFLElBQUksRUFBRSxrQ0FBa0M7WUFDakQsS0FBSyxFQUFFO2dCQUNMLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVztnQkFDdkIsVUFBVSxFQUFFLENBQUMsRUFBRSx3QkFBd0I7Z0JBQ3ZDLFdBQVcsRUFBRSxLQUFLLEVBQUUsb0JBQW9CO2FBQ3pDO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRSxLQUFLO2FBQ2I7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLEtBQUs7Z0JBQ1osZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNELEVBQUUsRUFBRTtnQkFDRixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLEtBQUs7b0JBQ1osT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsWUFBWSxFQUFFLEtBQUs7YUFDcEI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sY0FBYyxFQUFFLEtBQUs7Z0JBQ3JCLGdCQUFnQixFQUFFLEtBQUs7YUFDeEI7U0FDRixDQUFDO1FBRUYsY0FBYztRQUNkLFlBQU8sR0FBd0IsU0FBUyxDQUFDO1FBT3ZDLFNBQVM7UUFDVCxJQUFJLENBQUMsTUFBTSxxQkFBTyxNQUFNLE9BQUMsQ0FBQztRQUUxQixjQUFjO1FBQ2QsbUZBQW1GO1FBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7WUFDckMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN0QyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7WUFDcEMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsNEJBQTRCO1FBQzVCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBRUQsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsNERBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRW5ELHNCQUFzQjtRQUN0QixTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QixnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7WUFDcEMsbUNBQW1DO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsMEJBQTBCO1FBQzFCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFDLEtBQUs7WUFDbEQsSUFBSSxRQUFRLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUMzQyxtQ0FBbUM7Z0JBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDL0IsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLHNDQUFzQztnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILCtCQUErQjtRQUMvQixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUVqQyxtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVPLDZCQUFZLEdBQXBCO1FBQ0UsZ0JBQWdCO1FBQ2hCLElBQU0sTUFBTSxHQUFHLDREQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFMUMsMkJBQTJCO1FBQzNCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsVUFBQyxLQUFLO1lBQzNDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxxREFBcUQ7SUFDckQsNEJBQVcsR0FBWCxVQUFZLFVBQXFDO1FBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDSyxzQkFBSyxHQUFiLFVBQWMsU0FBaUI7UUFDN0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQyxRQUFRLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFXLElBQUksQ0FBQyxLQUFLLENBQUUsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFRCxhQUFhO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV6Qiw2QkFBNkI7UUFDN0IsNERBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLGtCQUFrQjtRQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFcEMsZUFBZTtRQUNmLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDekIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQU0sQ0FBQyxDQUFDO1lBQzlHLENBQUM7WUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzFDLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sYUFBVSxDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUVELGFBQWE7UUFDYixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFbEIsdUJBQXVCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBRUQsa0JBQWtCO1FBQ2xCLHNFQUFzRTtRQUN0RSxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0sseUJBQVEsR0FBaEIsVUFBaUIsU0FBaUI7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDM0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFNBQVMsQ0FBQztJQUN2QyxDQUFDO0lBRU8sNEJBQVcsR0FBbkIsVUFBb0IsS0FBYSxFQUFFLEtBQWEsRUFBRSxLQUFhO1FBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVPLDJCQUFVLEdBQWxCO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzRCw0REFBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixHQUFHLENBQUMsQ0FBQztRQUMzSCxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLHdFQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3RFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSx3RUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUN2RSw0REFBVyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsd0VBQWUsQ0FBQyxTQUFTLEVBQUUsd0VBQWUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2pILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyx3RUFBZSxDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyx3RUFBZSxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztvQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDO29CQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFHLENBQUMsQ0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZO29CQUNySCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFHLENBQUMsQ0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhO2dCQUN6SCxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRU8sNENBQTJCLEdBQW5DO1FBQUEsaUJBeUNDO1FBeENDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLO1lBQ3ZDLFFBQVEsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNsQixLQUFLLEdBQUc7b0JBQ04sS0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3JELE1BQU07Z0JBQ1IsS0FBSyxHQUFHO29CQUNOLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUN6RCxNQUFNO2dCQUNSLEtBQUssR0FBRztvQkFDTixLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7b0JBQzNELE1BQU07Z0JBQ1IsS0FBSyxHQUFHO29CQUNOLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDN0MsTUFBTTtnQkFDUixLQUFLLEdBQUc7b0JBQ04sS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO29CQUM3RCxNQUFNO2dCQUNSLEtBQUssR0FBRztvQkFDTixLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7b0JBQ25ELE1BQU07Z0JBQ1IsS0FBSyxHQUFHO29CQUNOLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztvQkFDdkUsTUFBTTtnQkFDUixLQUFLLEdBQUc7b0JBQ04sS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO29CQUMvRCxNQUFNO2dCQUNSLEtBQUssR0FBRztvQkFDTixLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7b0JBQy9ELE1BQU07Z0JBQ1IsS0FBSyxHQUFHO29CQUNOLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDekQsTUFBTTtnQkFDUixLQUFLLEdBQUc7b0JBQ04sY0FBYztvQkFDZCxNQUFNO2dCQUNSLEtBQUssR0FBRztvQkFDTixjQUFjO29CQUNkLE1BQU07WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sMENBQXlCLEdBQWpDO1FBQUEsaUJBY0M7UUFiQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsVUFBQyxLQUFtQjtZQUM5RCxPQUFPLENBQUMsR0FBRyxDQUNULHlEQUF5RCxFQUN6RCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ2hCLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUMxQixDQUFDO1lBQ0YsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFLFVBQUMsS0FBbUI7WUFDakUsS0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwUkQ7SUFBQTtJQW9EQSxDQUFDO0lBekNDLHNCQUFXLGdDQUFhO1FBSHhCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLGVBQWUsQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLGtCQUFrQixDQUFDO1FBQ3hFLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsK0JBQVk7YUFBdkI7WUFDRSxPQUFPLGVBQWUsQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDO1FBQ3ZFLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsK0JBQVk7YUFBdkI7WUFDRSxPQUFPLGVBQWUsQ0FBQyxrQkFBa0IsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUM7UUFDaEYsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxrQ0FBZTtRQUgxQjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxlQUFlLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUM7OztPQUFBO0lBS0Qsc0JBQVcscUNBQWtCO1FBSDdCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLGVBQWUsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx1Q0FBb0I7YUFBL0I7WUFDRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx1Q0FBb0I7YUFBL0I7WUFDRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDcEMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx3Q0FBcUI7YUFBaEM7WUFDRSxPQUFPLGVBQWUsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsd0NBQXFCO2FBQWhDO1lBQ0UsT0FBTyxlQUFlLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUMzQyxDQUFDOzs7T0FBQTtJQWxETSxrQ0FBa0IsR0FBRyxFQUFFLENBQUMsQ0FBQyx3QkFBd0I7SUFDakQsaUNBQWlCLEdBQUcsRUFBRSxDQUFDLENBQUMsdUJBQXVCO0lBQy9DLHlCQUFTLEdBQVcsRUFBRSxDQUFDLENBQUMsbURBQW1EO0lBQzNFLHVDQUF1QixHQUFXLEVBQUUsQ0FBQyxDQUFDLDBHQUEwRztJQUNoSix1Q0FBdUIsR0FBVyxFQUFFLENBQUMsQ0FBQyxrSEFBa0g7SUFDeEosK0NBQStCLEdBQVksS0FBSyxDQUFDLENBQUMsMERBQTBEO0lBOENySCxzQkFBQztDQUFBO0FBcERvQzs7Ozs7Ozs7Ozs7Ozs7O0FDT3JDO0lBVUUsa0JBQ1ksS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87UUFOeEIsWUFBTyxHQUF3QixFQUFFLENBQUM7UUFRaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILDBCQUFPLEdBQVA7UUFDRSx3QkFBd0I7SUFDMUIsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QnNEO0FBRVk7QUFrQm5FLElBQU0scUJBQXFCLEdBQVksS0FBSyxDQUFDO0FBQzdDLElBQU0sb0JBQW9CLEdBQVcsQ0FBQyxDQUFDO0FBQ3ZDLElBQU0sc0JBQXNCLEdBQVcsQ0FBQyxDQUFDO0FBQ3pDLElBQU0sb0JBQW9CLEdBQVcsQ0FBQyxDQUFDO0FBRXZDLElBQU0scUJBQXFCLEdBQVksS0FBSyxDQUFDO0FBQzdDLElBQU0sdUJBQXVCLEdBQVcsQ0FBQyxDQUFDO0FBRTFDO0lBdUVFLHFCQUNZLEtBQVksRUFDdEIsTUFBNkI7O1FBRG5CLFVBQUssR0FBTCxLQUFLLENBQU87UUF2RXhCLE9BQUUsR0FBVyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFakMsV0FBVztRQUNYLGNBQVMsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUN2QixjQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdkIsWUFBTyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLFlBQU8sR0FBVyxDQUFDLENBQUMsQ0FBQztRQUVyQixhQUFhO1FBQ2IsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBWW5CLHFFQUFxRTtRQUNyRSxpQkFBWSxHQUFtRCxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7UUFDekYsbUJBQWMsR0FBaUQsRUFBRSxDQUFDLENBQUMsbUJBQW1CO1FBS3RGLFFBQVE7UUFDUixxQkFBZ0IsR0FBWSxJQUFJLENBQUMsQ0FBQyw0RUFBNEU7UUFDOUcscUJBQWdCLEdBQVksSUFBSSxDQUFDLENBQUMsNEVBQTRFO1FBQzlHLHNCQUFpQixHQUFZLEtBQUssQ0FBQyxDQUFDLHdHQUF3RztRQTBDMUksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRWhDLG1CQUFtQjtRQUNuQixJQUFJLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ2xDLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2hDLENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNsQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNoQyxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDaEMsQ0FBQztRQUVELElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDaEMsQ0FBQztRQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBTSxDQUFDLFlBQVksbUNBQUkscUJBQXFCLENBQUM7UUFDakUsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFNLENBQUMsV0FBVyxtQ0FBSSxvQkFBb0IsQ0FBQztRQUM5RCxJQUFJLENBQUMsYUFBYSxHQUFHLFlBQU0sQ0FBQyxhQUFhLG1DQUFJLHNCQUFzQixDQUFDO1FBRXBFLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBTSxDQUFDLFlBQVksbUNBQUkscUJBQXFCLENBQUM7UUFDakUsSUFBSSxDQUFDLGNBQWMsR0FBRyxZQUFNLENBQUMsY0FBYyxtQ0FBSSx1QkFBdUIsQ0FBQztRQUN2RSxJQUFJLENBQUMsV0FBVyxHQUFHLFlBQU0sQ0FBQyxXQUFXLG1DQUFJLG9CQUFvQixDQUFDO0lBQ2hFLENBQUM7SUE3REQsc0JBQUksb0NBQVc7UUFaZixpR0FBaUc7UUFDakcsb0VBQW9FO1FBQ3BFLDJIQUEySDtRQUMzSCx5Q0FBeUM7UUFDekMsc0hBQXNIO1FBQ3RILDhGQUE4RjtRQUM5Riw2QkFBNkI7UUFDN0IsOEJBQThCO1FBQzlCLGlDQUFpQztRQUNqQywyQkFBMkI7UUFFM0IsaUdBQWlHO2FBQ2pHO1lBTUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxxR0FBcUc7WUFDbkksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7WUFFMUQsV0FBVztZQUNYLG1DQUFtQztZQUNuQyxxQ0FBcUM7WUFDckMsc0NBQXNDO1lBQ3RDLG9DQUFvQztZQUNwQyxLQUFLO1lBRUwsT0FBTztnQkFDTCxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLO2dCQUNsQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTTtnQkFDcEMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3JCLENBQUM7UUFDSixDQUFDOzs7T0FBQTtJQTZDRDs7O09BR0c7SUFDSCw0Q0FBc0IsR0FBdEIsVUFBdUIsT0FBaUM7UUFDdEQsaUVBQVcsQ0FBQyxlQUFlLENBQ3pCLE9BQU8sRUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLDZFQUFlLENBQUMsU0FBUyxDQUFDLEVBQzdELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsNkVBQWUsQ0FBQyxTQUFTLENBQUMsRUFDNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLDZFQUFlLENBQUMsU0FBUyxDQUFDLEVBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyw2RUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUNuRCxLQUFLLENBQ04sQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSCw4Q0FBd0IsR0FBeEIsVUFBeUIsT0FBaUM7UUFDeEQsaUVBQVcsQ0FBQyxhQUFhLENBQ3ZCLE9BQU8sRUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyw2RUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsNkVBQWUsQ0FBQyxTQUFTLENBQUMsRUFDbkQsRUFBRSxNQUFNLEVBQUUsS0FBSyxHQUFHLENBQ25CLENBQUM7SUFDSixDQUFDO0lBRUQsc0JBQUksZ0RBQXVCO2FBQTNCO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0QsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxnREFBdUI7YUFBM0I7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMzRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLG1DQUFVO2FBQWQ7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsNkVBQWUsQ0FBQyxTQUFTLENBQUM7UUFDaEQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxvQ0FBVzthQUFmO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLDZFQUFlLENBQUMsU0FBUyxDQUFDO1FBQ2pELENBQUM7OztPQUFBO0lBRUQscUNBQWUsR0FBZixVQUFnQixNQUFtQjtRQUNqQyxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELDhDQUF3QixHQUF4QixVQUF5QixNQUFtQjtRQUMxQyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUcsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzVHLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELDRDQUFzQixHQUF0QixVQUF1QixNQUFtQjtRQUN4QyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEcsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlHLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZOa0U7QUFDWjtBQUlGO0FBdUNyRDs7Ozs7Ozs7Ozs7Ozs7RUFjRTtBQUVGO0lBd0RFLGVBQ1ksTUFBYztRQUQxQixpQkFzRUM7UUFyRVcsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXREMUIsbUNBQThCLEdBQTJELEVBQUUsQ0FBQyxDQUFDLG1EQUFtRDtRQUVoSixVQUFVO1FBQ1YsWUFBTyxHQUFrQixFQUFFLENBQUM7UUFDNUIsb0VBQW9FO1FBRXBFLHVDQUF1QztRQUM5QixZQUFPLEdBQTJCO1lBQ3pDLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsS0FBSyxFQUFFLEtBQUs7aUJBQ2I7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxDQUFDO29CQUNKLENBQUMsRUFBRSxDQUFDO29CQUNKLE1BQU0sRUFBRSxDQUFDO29CQUNULE1BQU0sRUFBRSxDQUFDO2lCQUNWO2FBQ0Y7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLENBQUM7Z0JBQ1QsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsSUFBSSxFQUFFLENBQUM7YUFDUjtZQUNELFFBQVEsRUFBRSxFQUFFO1lBQ1osZ0JBQWdCLEVBQUUsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDO1NBQ3JDLENBQUM7UUFFRixPQUFPO1FBQ1AsNEhBQTRIO1FBQzVILHdCQUFtQixHQUF1QixTQUFTLENBQUMsQ0FBQywyRkFBMkY7UUFDaEosU0FBSSxHQUFtQyxFQUFFLENBQUMsQ0FBQyw4R0FBOEc7UUFHekoscUJBQXFCO1FBQ3JCLHFCQUFnQixHQUEwQjtZQUN4QyxVQUFVLEVBQUUsRUFBRTtZQUNkLE9BQU8sRUFBRSxFQUFFO1NBQ1osQ0FBQztRQUVGLG9CQUFvQjtRQUNILGlCQUFZLEdBQVksUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN2RSxlQUFVLEdBQTJCLEVBQUUsQ0FBQyxDQUFDLHVGQUF1RjtRQWdGekksa0NBQTZCLEdBQTJCLEVBQUUsQ0FBQztRQXJFekQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRWpDLHdCQUF3QjtRQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxVQUFDLEtBQWlCO1lBQzVELEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRywrREFBVSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEYsS0FBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRO1FBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBQyxLQUFpQjtZQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxDQUFDO29CQUNKLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNyQyxNQUFNO2dCQUNSLEtBQUssQ0FBQztvQkFDSixLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDdkMsTUFBTTtnQkFDUixLQUFLLENBQUM7b0JBQ0osS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ3RDLE1BQU07WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQWlCO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNyQixLQUFLLENBQUM7b0JBQ0osS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQ3RDLE1BQU07Z0JBQ1IsS0FBSyxDQUFDO29CQUNKLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUN4QyxNQUFNO2dCQUNSLEtBQUssQ0FBQztvQkFDSixLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDdkMsTUFBTTtZQUNWLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVE7UUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxVQUFDLEtBQWlCO1lBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25DLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsVUFBQyxLQUFpQjtZQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqQyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFvQjtZQUN4RCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDakIsT0FBTztZQUNULENBQUM7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoQyxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBb0I7WUFDdEQsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2pCLE9BQU87WUFDVCxDQUFDO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUlELGtEQUFrRDtJQUNsRCxxQkFBSyxHQUFMLFVBQU0sS0FBYTtRQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDN0MsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDekIsQ0FBQztJQUNILENBQUM7SUFFRCxnQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBYTtRQUE5QixpQkFvRUM7UUFuRUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDN0MsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7WUFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RCxpRUFBVyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3pDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFFMUQsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7d0JBQ3ZCLFNBQVM7b0JBQ1gsQ0FBQztvQkFFRCxJQUFJLGNBQWMsVUFBQztvQkFDbkIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQzt3QkFDdEMsbUNBQW1DO3dCQUNuQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsQ0FBQzt5QkFBTSxDQUFDO3dCQUNOLGlFQUFpRTt3QkFDakUsSUFBSSxLQUFJLENBQUMsOEJBQThCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDOzRCQUNuRSxLQUFJLENBQUMsOEJBQThCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDeEQsQ0FBQzt3QkFFRCxJQUFJLEtBQUksQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7NEJBQ3RFLEtBQUksQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUMzRCxDQUFDO3dCQUVELElBQUksS0FBSyxVQUFDO3dCQUNWLElBQUksS0FBSSxDQUFDLDhCQUE4QixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQzs0QkFDekUsS0FBSyxHQUFHLENBQUMsQ0FBQzt3QkFDWixDQUFDOzZCQUFNLENBQUM7NEJBQ04sS0FBSyxHQUFHLEtBQUksQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO3dCQUN6RSxDQUFDO3dCQUVELDhDQUE4Qzt3QkFDOUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7NEJBQ3hDLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO3dCQUM5QyxDQUFDO3dCQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOzRCQUNsRCxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0NBQ2xDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUN6QyxNQUFNOzRCQUNSLENBQUM7d0JBQ0gsQ0FBQzt3QkFFRCxLQUFJLENBQUMsOEJBQThCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDakUsQ0FBQztvQkFFRCxpRUFBVyxDQUFDLFlBQVksQ0FDdEIsT0FBTyxFQUNQLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFDaEMsY0FBYyxDQUFDLE9BQU8sRUFDdEIsY0FBYyxDQUFDLE9BQU8sRUFDdEIsQ0FBQyxFQUNELENBQUMsQ0FDRixDQUFDO2dCQUNKLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNILENBQUM7SUFFRCw2QkFBYSxHQUFiLFVBQWMsS0FBYTtRQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtZQUMxQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDcEMsQ0FBQztJQUNILENBQUM7SUFFRCw2QkFBYSxHQUFiLFVBQWMsS0FBYTtRQUEzQixpQkFrQ0M7UUFqQ0MsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPO1lBQzVDLGlFQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtZQUMxQixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUM5QyxNQUFNLENBQUMsd0JBQXdCLENBQzdCLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUNsRCxDQUFDO1lBQ0osQ0FBQztZQUVELElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQ1gsS0FBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQ2xELENBQUM7WUFDSixDQUFDO1lBRUQsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FDM0IsS0FBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQ2xELENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDcEMsQ0FBQztJQUNILENBQUM7SUFFRCwrQkFBZSxHQUFmO1FBQUEsaUJBY0M7UUFiQyx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUU3QixTQUFTO1FBQ1QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPO1lBQy9DLEtBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPO1lBQzVDLEtBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlCQUFTLEdBQVQsVUFBVSxXQUF3QjtRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsK0dBQStHO0lBQy9HLHVJQUF1STtJQUN2SSxrQ0FBa0M7SUFDbEMsNEJBQVksR0FBWixVQUFhLFdBQXdCO1FBQ25DLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hCLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELHlJQUF5STtJQUN6SSwrQkFBK0I7SUFDL0IsZ0NBQWdCLEdBQWhCLFVBQWlCLGFBQXFCO1FBQ3BDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQUMsSUFBSSxRQUFDLENBQUMsRUFBRSxLQUFLLGFBQWEsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO1FBQzVELElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3pCLE9BQU87UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGdDQUFnQixHQUFoQixVQUFpQixJQUFTO1FBQ3hCLGtGQUFrRjtRQUNsRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQUMsSUFBSSxRQUFDLFlBQVksSUFBSSxFQUFqQixDQUFpQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsc0NBQXNCLEdBQXRCLFVBQXVCLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxXQUF5QjtRQUNwRixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBeEUsQ0FBd0UsQ0FBQyxDQUFDO1FBQzlHLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3pCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELHdDQUF3QztRQUN4QyxJQUFJLFdBQVcsS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUMzQixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILDJDQUEyQixHQUEzQixVQUE0QixTQUFpQixFQUFFLFNBQWlCLEVBQUUsV0FBeUI7UUFDekYsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBQyxJQUFJLFFBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQXBFLENBQW9FLENBQUMsQ0FBQztRQUMxRyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCx3Q0FBd0M7UUFDeEMsSUFBSSxXQUFXLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDM0IsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsNkJBQWEsR0FBYixVQUFjLFNBQWlCLEVBQUUsU0FBaUI7UUFDaEQsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvRyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsZ0RBQWdDLEdBQWhDLFVBQWlDLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxXQUF5QjtRQUM5RixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQy9JLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxtQ0FBbUIsR0FBbkIsVUFBb0IsU0FBaUIsRUFBRSxTQUFpQixFQUFFLElBQVU7UUFDbEUscUNBQXFDO1FBQ3JDLDRDQUE0QztRQUM1QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQUMsSUFBSSxRQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsY0FBYyxLQUFLLDZFQUFlLENBQUMsa0JBQWtCLEVBQWpILENBQWlILENBQUMsQ0FBQztJQUNuSixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsdUNBQXVCLEdBQXZCLFVBQXdCLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxJQUFVO1FBQ3RFLHFDQUFxQztRQUNyQyw0Q0FBNEM7UUFDNUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLGNBQWMsS0FBSyw2RUFBZSxDQUFDLGtCQUFrQixFQUFqSCxDQUFpSCxDQUFDLENBQUM7SUFDckosQ0FBQztJQUVPLGdDQUFnQixHQUF4QjtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNELHFCQUFxQjtJQUN2QixDQUFDO0lBRU8seUNBQXlCLEdBQWpDO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsc0NBQXNCLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixHQUFHO1lBQ3RCLFVBQVUsRUFBRSxFQUFFO1lBQ2QsT0FBTyxFQUFFLEVBQUU7U0FDWixDQUFDO1FBRUYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxpRUFBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RSxDQUFDO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLDZFQUFlLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNqRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxpRUFBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRSxDQUFDO0lBQ0gsQ0FBQztJQUVPLDRCQUFZLEdBQXBCO1FBQ0UsSUFBSSxNQUFNLEdBQUcsaUVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2RSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBYTtRQUM1QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0lBQ25DLENBQUM7SUFFRCxtREFBbUQ7SUFDbkQseUJBQVMsR0FBVCxVQUFVLEtBQWE7O1FBQ3JCLGVBQWU7UUFDZixJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBRUQsaUJBQWlCO1FBQ2pCLCtDQUErQztRQUMvQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUVqQyxpQkFBaUI7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLFVBQUksQ0FBQyxnQkFBZ0IsRUFBQyxJQUFJLFdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6RCxVQUFJLENBQUMsT0FBTyxFQUFDLElBQUksV0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtRQUV2Qyw0QkFBNEI7UUFDNUIsb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBRTlCLGNBQWM7UUFDZCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCwyQkFBVyxHQUFYLFVBQVksVUFBZTtRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsaUNBQWlCLEdBQWpCLFVBQWtCLFFBQWlDO1FBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxzQ0FBc0IsR0FBdEI7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsZ0NBQWdCLEdBQWhCLFVBQWlCLFNBQWlCLEVBQUUsUUFBYTtRQUMvQyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsbUNBQW1CLEdBQW5CLFVBQW9CLFNBQWlCLEVBQUUsUUFBYTtRQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsNkJBQWEsR0FBYixVQUFjLFNBQWlCLEVBQUUsTUFBWTtRQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLFdBQUcsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNILFlBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDcGlCRDtJQUtFLHlCQUFZLE9BQWUsRUFBRSxNQUE4QjtRQUN6RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSyxJQUFLLFVBQUcsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFwQixDQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCwrREFBK0Q7SUFDL0Qsc0NBQVksR0FBWixVQUFhLElBQVk7UUFDdkIsSUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkMsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVDLGVBQWUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUMzQyxJQUFJLFdBQVcsR0FBRyxlQUFlLEVBQUUsQ0FBQztnQkFDbEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEJrRjtBQUVuRixJQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQUMzQixJQUFNLG1CQUFtQixHQUFHLGNBQWEsQ0FBQyxDQUFDO0FBUzNDOztHQUVHO0FBQ0g7SUFBb0Msa0NBQVc7SUFRN0Msd0JBQ1ksS0FBWSxFQUN0QixNQUE0Qjs7UUFFNUIsa0JBQUssWUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQUM7UUFIWCxXQUFLLEdBQUwsS0FBSyxDQUFPO1FBUmhCLFdBQUssR0FBRyxDQUFDLENBQUM7UUFDVix1QkFBaUIsR0FBRyxDQUFDLENBQUM7UUFZNUIsS0FBSSxDQUFDLFFBQVEsR0FBRyxZQUFNLENBQUMsUUFBUSxtQ0FBSSxnQkFBZ0IsQ0FBQztRQUNwRCxLQUFJLENBQUMsVUFBVSxHQUFHLFlBQU0sQ0FBQyxVQUFVLG1DQUFJLG1CQUFtQixDQUFDO1FBQzNELEtBQUksQ0FBQyxTQUFTLEdBQUcsWUFBTSxDQUFDLFNBQVMsbUNBQUksU0FBUyxDQUFDO1FBQy9DLEtBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQzs7SUFDMUMsQ0FBQztJQUVELCtCQUFNLEdBQU4sVUFBTyxLQUFhO1FBQ2xCLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO1FBRXBCLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLHlFQUF5RTtZQUV0RyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUV6QixJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDckUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsZ0NBQU8sR0FBUDtRQUNFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQ0F6Q21DLGlFQUFXLEdBeUM5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeERrRjtBQUM1QjtBQWF2RDtJQUFrQyxnQ0FBVztJQVEzQyxzQkFBc0IsS0FBWSxFQUFFLE1BQWM7O1FBQ2hELGtCQUFLLFlBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxTQUFDO1FBREQsV0FBSyxHQUFMLEtBQUssQ0FBTztRQVBsQyxrQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixrQkFBWSxHQUFHLEtBQUssQ0FBQztRQVNuQixLQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzVCLEtBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUIsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzlCLEtBQUksQ0FBQyxXQUFXLEdBQUcsWUFBTSxDQUFDLFdBQVcsbUNBQUksQ0FBQyxDQUFDOztJQUM3QyxDQUFDO0lBRUQsNkJBQU0sR0FBTixVQUFPLE9BQWlDO1FBQ3RDLGlFQUFXLENBQUMsWUFBWSxDQUN0QixPQUFPLEVBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQzdCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsTUFBTSxDQUNaLENBQUM7SUFDSixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLENBL0JpQyxpRUFBVyxHQStCNUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q0Q7SUFBQTtJQWNBLENBQUM7SUFiQyx3QkFBd0I7SUFDakIsNEJBQWtCLEdBQXpCLFVBQTBCLEdBQVcsRUFBRSxHQUFXO1FBQ2hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVNLCtCQUFxQixHQUE1QixVQUE2QixHQUFXLEVBQUUsR0FBVztRQUNuRCxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQy9DLENBQUM7SUFFRCwwREFBMEQ7SUFDbkQsNkJBQW1CLEdBQTFCLFVBQTJCLE9BQWdCO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxhQUFQLE9BQU8sY0FBUCxPQUFPLEdBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkK0Q7QUFTaEU7SUFBQTtJQXlFQSxDQUFDO0lBeEVDOzs7Ozs7T0FNRztJQUNJLDJCQUFnQixHQUF2QixVQUF3QixNQUF5QixFQUFFLEtBQWlCO1FBQ2xFLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRWxELElBQUksb0JBQW9CLEdBQUc7WUFDekIsTUFBTSxFQUFFLFlBQVksQ0FBQyxNQUFNO1lBQzNCLEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSztTQUMxQixDQUFDO1FBRUYsSUFBSSxhQUFhLEdBQUc7WUFDbEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDO1FBRUYsdUpBQXVKO1FBQ3ZKLElBQUksS0FBSyxDQUFDLENBQUMsb0RBQW9EO1FBQy9ELElBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLG9EQUFvRDtZQUUvRix1QkFBdUI7WUFDdkIsb0JBQW9CLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBRXBELHdCQUF3QjtZQUN4QixJQUFJLGdCQUFnQixHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzRSxhQUFhLENBQUMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQzthQUFNLENBQUM7WUFDTixLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsb0RBQW9EO1lBRWpHLHVCQUF1QjtZQUN2QixvQkFBb0IsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbEQsd0JBQXdCO1lBQ3hCLElBQUksZUFBZSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RSxhQUFhLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQztRQUN2RCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztRQUV6RCxrRkFBa0Y7UUFDbEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDO1FBQzNGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyx3RUFBZSxDQUFDLFNBQVMsQ0FBQztRQUMxRixPQUFPO1lBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLEVBQUUsQ0FBQztZQUNULE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQztJQUNKLENBQUM7SUFFTSxvQkFBUyxHQUFoQixVQUFpQixNQUF5QixFQUFFLE1BQWM7UUFDeEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsZ0JBQVEsTUFBTSxjQUFVLENBQUM7SUFDakQsQ0FBQztJQUVELHNCQUFtQiwwQkFBWTthQUEvQjtZQUNFLE9BQU8sUUFBUSxDQUFDLGlCQUFpQixLQUFLLElBQUksQ0FBQztRQUM3QyxDQUFDOzs7T0FBQTtJQUVNLHdCQUFhLEdBQXBCLFVBQXFCLGFBQTRCLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUNwRyxPQUFPLENBQ0wsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQ3pCLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLEtBQUs7WUFDakMsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQ3pCLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FDbkMsQ0FBQztJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEYrRDtBQUVoRTtJQUFBO0lBcU5BLENBQUM7SUFwTlEsd0JBQVksR0FBbkIsVUFDRSxPQUFpQyxFQUNqQyxXQUE2QixFQUM3QixPQUFlLEVBQ2YsT0FBZSxFQUNmLFNBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLFdBQW9CLEVBQ3BCLFlBQXFCLEVBQ3JCLE9BQWdHLENBQUMscUNBQXFDOzs7UUFBdEksc0NBQWdHO1FBRWhHLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyx3RUFBZSxDQUFDLFNBQVMsQ0FBQztRQUM5RixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyx3RUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsd0VBQWUsQ0FBQyxTQUFTLENBQUM7UUFDakcsSUFBSSxLQUFLLEdBQUcsYUFBTyxDQUFDLEtBQUssbUNBQUksQ0FBQyxDQUFDLENBQUMsMEJBQTBCO1FBQzFELElBQUksUUFBUSxHQUFHLGFBQU8sQ0FBQyxRQUFRLG1DQUFJLENBQUMsQ0FBQyxDQUFDLGtDQUFrQztRQUV4RSw4RUFBOEU7UUFDOUUsOERBQThEO1FBQzlELElBQUksYUFBYSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksY0FBYyxHQUFHLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXRDLElBQUksVUFBVSxHQUFHLENBQUMsYUFBYSxJQUFJLGNBQWMsQ0FBQyxDQUFDO1FBQ25ELElBQUksVUFBVSxFQUFFLENBQUM7WUFDZixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFZixJQUFJLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsSUFBSSxjQUFjLEVBQUUsQ0FBQztnQkFDbkIscUVBQXFFO2dCQUNyRSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsd0VBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ2pHLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyx3RUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFFbEcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQzlDLDBMQUEwTDtnQkFDMUwsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sQ0FBQyxTQUFTLENBQ2YsV0FBVyxFQUNYLE9BQU8sR0FBRyx3RUFBZSxDQUFDLFNBQVMsRUFBRSw4Q0FBOEM7UUFDbkYsT0FBTyxHQUFHLHdFQUFlLENBQUMsU0FBUyxFQUFFLDhDQUE4QztRQUNuRixLQUFLLEVBQ0wsTUFBTSxFQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEVBQUUsMEZBQTBGO1FBQzdJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEVBQUUsMEZBQTBGO1FBQzdJLEtBQUssR0FBRyxLQUFLLEVBQ2IsTUFBTSxHQUFHLEtBQUssQ0FDZixDQUFDO1FBRUYsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixDQUFDO0lBQ0gsQ0FBQztJQUVNLDRCQUFnQixHQUF2QixVQUNFLE1BQWdDLEVBQ2hDLFdBQXFDLEVBQ3JDLE1BQWMsRUFDZCxNQUFjLEVBQ2QsSUFBWSxFQUNaLElBQVk7UUFFWixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyx3RUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsd0VBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyx3RUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdELFdBQVcsQ0FBQyxTQUFTLENBQ25CLE1BQU0sQ0FBQyxNQUFNLEVBQ2IsV0FBVyxFQUNYLFdBQVcsRUFDWCxTQUFTLEdBQUcsV0FBVyxFQUN2QixTQUFTLEdBQUcsV0FBVyxFQUN2QixDQUFDLEVBQ0QsQ0FBQyxFQUNELFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUN4QixXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FDMUIsQ0FBQztJQUNKLENBQUM7SUFFTSx3QkFBWSxHQUFuQixVQUFvQixPQUFpQyxFQUFFLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxPQUFrQztRQUFsQyxzQ0FBa0M7UUFDN0gsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsQ0FBQyxTQUFTLEdBQUcsd0VBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHdFQUFlLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUN6RSxDQUFDLFNBQVMsR0FBRyx3RUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsd0VBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQ3pFLHdFQUFlLENBQUMsU0FBUyxHQUFHLENBQUMsRUFDN0IsQ0FBQyxFQUNELENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUNaLENBQUM7UUFDRixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakIsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLGFBQWEsQ0FBQztRQUNwRCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVELHdGQUF3RjtJQUNqRix5QkFBYSxHQUFwQixVQUNFLE9BQWlDLEVBQ2pDLFNBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLEtBQWEsRUFDYixNQUFjLEVBQ2QsT0FBNEQ7UUFBNUQsc0NBQTREO1FBRTVELE9BQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2hFLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsSUFBSSxDQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEVBQUUsNkRBQTZEO1FBQ2hILElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLEVBQUUsNkRBQTZEO1FBQ2hILEtBQUssRUFDTCxNQUFNLENBQ1AsQ0FBQztRQUNGLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVNLDJCQUFlLEdBQXRCLFVBQXVCLE9BQWlDLEVBQUUsU0FBaUIsRUFBRSxTQUFpQixFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsTUFBZTtRQUM1SSxPQUFPLENBQUMsV0FBVyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUM7UUFDeEMsdUtBQXVLO1FBQ3ZLLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRSxTQUFTLEdBQUcsR0FBRyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFTSx1QkFBVyxHQUFsQixVQUFtQixPQUFpQztRQUNsRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sd0JBQVksR0FBbkIsVUFBb0IsS0FBYyxFQUFFLE1BQWU7UUFDakQsZ0JBQWdCO1FBQ2hCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFaEQsbUJBQW1CO1FBQ25CLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsd0VBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHdFQUFlLENBQUMsWUFBWSxDQUFDO1FBQ3hGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsd0VBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHdFQUFlLENBQUMsYUFBYSxDQUFDO1FBRTVGLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxzQkFBVSxHQUFqQixVQUFrQixNQUF5QjtRQUN6QyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyx3RUFBZSxDQUFDLCtCQUErQixDQUFDO1FBRWhGLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxtQ0FBdUIsR0FBOUIsVUFBK0IsUUFBZ0I7UUFDN0MsT0FBTyxRQUFRLEdBQUcsd0VBQWUsQ0FBQyxTQUFTLENBQUM7SUFDOUMsQ0FBQztJQUVNLHNCQUFVLEdBQWpCLFVBQ0UsT0FBaUMsRUFDakMsSUFBWSxFQUNaLFNBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLE9BQWlEO1FBQWpELHNDQUFpRDtRQUVqRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRXZELE9BQU8sQ0FBQyxJQUFJLEdBQUcsVUFBRyxJQUFJLGlCQUFjLENBQUM7UUFDckMsT0FBTyxDQUFDLFNBQVMsR0FBRyxVQUFHLE1BQU0sQ0FBRSxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxRQUFRLENBQ2QsSUFBSSxFQUNKLFNBQVMsR0FBRyx3RUFBZSxDQUFDLFNBQVMsRUFBRSw4Q0FBOEM7UUFDckYsU0FBUyxHQUFHLHdFQUFlLENBQUMsU0FBUyxDQUFDLDhDQUE4QztTQUNyRixDQUFDO0lBQ0osQ0FBQztJQUVNLHVCQUFXLEdBQWxCLFVBQ0UsSUFBWSxFQUNaLEtBQWEsRUFDYixPQUFpRDs7UUFBakQsc0NBQWlEO1FBRWpELFdBQVc7UUFDWCxJQUFJLElBQUksR0FBRyxhQUFPLENBQUMsSUFBSSxtQ0FBSSxFQUFFLENBQUM7UUFDOUIsSUFBSSxNQUFNLEdBQUcsYUFBTyxDQUFDLE1BQU0sbUNBQUksT0FBTyxDQUFDO1FBRXZDLG9CQUFvQjtRQUNwQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQUcsSUFBSSxpQkFBYyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsVUFBRyxNQUFNLENBQUUsQ0FBQztRQUVoQyx3REFBd0Q7UUFDeEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEMsSUFBSSxXQUFXLEdBQUcsVUFBRyxXQUFXLGNBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFFL0MsMkJBQTJCO1lBQzNCLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pCLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLFNBQVM7WUFDWCxDQUFDO1lBRUQsdUJBQXVCO1lBQ3ZCLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pCLFNBQVM7WUFDWCxDQUFDO1lBRUQsb0NBQW9DO1lBQ3BDLFdBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZOc0U7QUFDNUI7QUFRM0M7SUFBZ0MsOEJBQUs7SUFPbkMsb0JBQXNCLE1BQWM7UUFDbEMsa0JBQUssWUFBQyxNQUFNLENBQUMsU0FBQztRQURNLFlBQU0sR0FBTixNQUFNLENBQVE7UUFOcEMsVUFBSSxHQUFHO1lBQ0wsb0RBQVE7U0FDVCxDQUFDO1FBT0EsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLEtBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFcEgsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFDcEIsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxDQWYrQixvREFBSyxHQWVwQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QmtFO0FBRWxCO0FBR1U7QUFDQztBQUNGO0FBQ0E7QUFDVTtBQUVwRSxJQUFNLFVBQVUsR0FBVyw2RUFBZSxDQUFDLGtCQUFrQixDQUFDO0FBQzlELElBQU0sU0FBUyxHQUFXLDZFQUFlLENBQUMsaUJBQWlCLENBQUM7QUFFNUQ7SUFBOEIsNEJBQVE7SUFVcEMsa0JBQXNCLEtBQWlCO1FBQ3JDLGtCQUFLLFlBQUMsS0FBSyxDQUFDLFNBQUM7UUFETyxXQUFLLEdBQUwsS0FBSyxDQUFZO1FBVHZDLFlBQU0sR0FBRyxVQUFVLENBQUM7UUFDcEIsV0FBSyxHQUFHLFNBQVMsQ0FBQztRQUVsQixzQkFBZ0IsR0FBc0IsRUFFckMsQ0FBQztRQUVGLGFBQU8sR0FBa0IsRUFBRSxDQUFDO1FBSzFCLGdDQUFnQztRQUNoQyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLHFFQUFZLENBQUMsS0FBSSxDQUFDLEtBQUssRUFBRTtZQUM3QyxTQUFTLEVBQUUsQ0FBQztZQUNaLFNBQVMsRUFBRSxDQUFDO1lBQ1osS0FBSyxFQUFFLDZFQUFlLENBQUMsaUJBQWlCO1lBQ3hDLE1BQU0sRUFBRSw2RUFBZSxDQUFDLGtCQUFrQjtZQUMxQyxPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQyxDQUFDLENBQUM7UUFFSixTQUFTO1FBQ1QsSUFBSSxNQUFNLEdBQUcsSUFBSSxxRUFBWSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSw2RUFBZ0IsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxXQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWpFLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksbUVBQVcsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkQsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxtRUFBVyxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLFdBQUcsQ0FBQyxDQUFDLENBQUM7O0lBQzlELENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxDQWpDNkIsMkRBQVEsR0FpQ3JDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQ00sSUFBTSxrQkFBa0IsR0FBVyxDQUFDLENBQUM7QUFDckMsSUFBTSxzQkFBc0IsR0FBVyxFQUFFLENBQUM7QUFDMUMsSUFBTSwyQkFBMkIsR0FBVyxDQUFDLEVBQUUsQ0FBQztBQUNoRCxJQUFNLGdCQUFnQixHQUFXLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtBQUN4RCxJQUFNLG1CQUFtQixHQUFXLENBQUMsQ0FBQyxDQUFDLGdDQUFnQztBQUU5RTtJQUFBO0lBTUEsQ0FBQztJQUxpQixvQ0FBa0IsR0FBVyxrQkFBa0IsQ0FBQztJQUNoRCx3Q0FBc0IsR0FBVyxzQkFBc0IsQ0FBQztJQUN4RCw2Q0FBMkIsR0FBVywyQkFBMkIsQ0FBQztJQUMzRSxrQ0FBZ0IsR0FBVyxnQkFBZ0IsQ0FBQztJQUNuQyxxQ0FBbUIsR0FBVyxtQkFBbUIsQ0FBQztJQUNwRSx3QkFBQztDQUFBO0FBTnNDOzs7Ozs7Ozs7Ozs7Ozs7QUNOdkMsSUFBWSxVQUlYO0FBSkQsV0FBWSxVQUFVO0lBQ3BCLG1DQUFxQjtJQUNyQixxQ0FBdUI7SUFDdkIsaUNBQW1CO0FBQ3JCLENBQUMsRUFKVyxVQUFVLEtBQVYsVUFBVSxRQUlyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSk0sSUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFDbEMsSUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFDbEMsSUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFDaEMsSUFBTSx3QkFBd0IsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSHBDLElBQU0scUJBQXFCO0lBQ2hDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ3JDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxHQUFHO0lBQzdDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxHQUFHO0lBQzFDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxHQUFHO0lBQzVDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEdBQUc7SUFDNUMsR0FBQyxHQUFHLElBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUc7SUFDM0MsR0FBQyxHQUFHLElBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUc7SUFDdkMsR0FBQyxHQUFHLElBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUc7SUFDdkMsR0FBQyxHQUFHLElBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDdkMsR0FBQyxHQUFHLElBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUc7T0FDNUMsQ0FBQztBQUVLLElBQU0sb0JBQW9CO0lBQy9CLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxHQUFHO0lBQzFDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxHQUFHO0lBQ3pDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ3hDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ3BDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ3hDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ3ZDLEdBQUMsR0FBRyxJQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxHQUFHO0lBQzFDLEdBQUMs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LE1BQU0sQ0FDUCxDQUFDO0FBQ0osQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi8uLi9jb3JlL2NsaWVudC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS9tb2RlbC9zY2VuZS1tYXAudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvbW9kZWwvc2NlbmUtb2JqZWN0LnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL21vZGVsL3NjZW5lLnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL21vZGVsL3Nwcml0ZS1hbmltYXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvb2JqZWN0cy9pbnRlcnZhbC5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvb2JqZWN0cy9zcHJpdGUub2JqZWN0LnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL3V0aWxzL21hdGgudXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvdXRpbHMvbW91c2UudXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvdXRpbHMvcmVuZGVyLnV0aWxzLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lLm1hcC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvY29uc3RhbnRzL2RlZmF1bHRzLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL2NvbnN0YW50cy9tZWRhbC5jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL2NvbnN0YW50cy9zcHJpdGUuY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9vYmplY3RzL2NvbnRyb2xsZXIub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9vYmplY3RzL2Zsb29yLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvb2JqZWN0cy9waXBlLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvb2JqZWN0cy9wbGF5ZXIub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9vYmplY3RzL3BvaW50Lm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvb2JqZWN0cy9zY29yZS1jYXJkLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvb2JqZWN0cy9zY29yZS5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL21haW4tbWVudS9tYWluLW1lbnUuc2NlbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL21haW4tbWVudS9tYXBzL21haW4tbWVudS5tYXAudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL21haW4tbWVudS9tYXBzL21haW4tbWVudS9iYWNrZ3JvdW5kcy9sYXllci4xLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9tYWluLW1lbnUvbWFwcy9tYWluLW1lbnUvb2JqZWN0cy9zdGFydC1idXR0b24ub2JqZWN0LnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJy4vY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlLCB0eXBlIFNjZW5lIH0gZnJvbSAnLi9tb2RlbC9zY2VuZSc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJy4vdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IHR5cGUgQXNzZXRzQ29uZmlnLCB0eXBlIEFzc2V0cyB9IGZyb20gJy4vbW9kZWwvYXNzZXRzJztcblxuZXhwb3J0IGNsYXNzIENsaWVudCB7XG4gIC8vIENvbnN0YW50c1xuICBwcml2YXRlIHJlYWRvbmx5IENBTlZBU19IRUlHSFQ6IG51bWJlciA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfSEVJR0hUO1xuICBwcml2YXRlIHJlYWRvbmx5IENBTlZBU19XSURUSDogbnVtYmVyID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19XSURUSDtcblxuICAvLyBVSVxuICBwdWJsaWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgcHVibGljIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHVibGljIGRlbHRhOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGxhc3RSZW5kZXJUaW1lc3RhbXA6IG51bWJlciA9IDA7XG5cbiAgLy8gRGF0YVxuICBwcml2YXRlIHJlYWRvbmx5IHNjZW5lczogU2NlbmVDb25zdHJ1Y3RvclNpZ25hdHVyZVtdO1xuICBwcml2YXRlIGN1cnJlbnRTY2VuZTogU2NlbmU7XG5cbiAgLy8gQXNzZXRzXG4gIGFzc2V0czogQXNzZXRzID0ge1xuICAgIGltYWdlczoge30sXG4gICAgYXVkaW86IHt9LFxuICB9O1xuXG4gIC8vIERlYnVnXG4gIGRlYnVnID0ge1xuICAgIGVuYWJsZWQ6IHRydWUsIC8vIGlmIHRydWUsIGRlYnVnIGtleXMgYXJlIGVuYWJsZWRcbiAgICBzdGF0czoge1xuICAgICAgZnBzOiBmYWxzZSwgLy8gc2hvdyBmcHNcbiAgICAgIGZwc0NvdW50ZXI6IDAsIC8vIHRpbWUgc2luY2UgbGFzdCBjaGVja1xuICAgICAgb2JqZWN0Q291bnQ6IGZhbHNlLCAvLyBzaG93IG9iamVjdCBjb3VudFxuICAgIH0sXG4gICAgYnJlYWtwb2ludDoge1xuICAgICAgZnJhbWU6IGZhbHNlLFxuICAgIH0sXG4gICAgdGltaW5nOiB7XG4gICAgICBmcmFtZTogZmFsc2UsXG4gICAgICBmcmFtZUJhY2tncm91bmQ6IGZhbHNlLFxuICAgICAgZnJhbWVVcGRhdGU6IGZhbHNlLFxuICAgICAgZnJhbWVSZW5kZXI6IGZhbHNlLFxuICAgIH0sXG4gICAgdWk6IHtcbiAgICAgIGdyaWQ6IHtcbiAgICAgICAgbGluZXM6IGZhbHNlLFxuICAgICAgICBudW1iZXJzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBjYW52YXNMYXllcnM6IGZhbHNlLFxuICAgIH0sXG4gICAgb2JqZWN0OiB7XG4gICAgICByZW5kZXJCb3VuZGFyeTogZmFsc2UsXG4gICAgICByZW5kZXJCYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICB9LFxuICB9O1xuXG4gIC8vIGNvbnRyb2xsZXJzXG4gIGdhbWVwYWQ6IEdhbWVwYWQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gICAgc2NlbmVzOiBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlW10sXG4gICAgYXNzZXRzOiBBc3NldHNDb25maWdcbiAgKSB7XG4gICAgLy8gc2NlbmVzXG4gICAgdGhpcy5zY2VuZXMgPSBbLi4uc2NlbmVzXTtcblxuICAgIC8vIGxvYWQgYXNzZXRzXG4gICAgLy8gVE9ETyhzbWcpOiBzb21lIHNvcnQgb2YgbG9hZGluZyBzY3JlZW4gLyByZW5kZXJpbmcgZGVsYXkgdW50aWwgYXNzZXRzIGFyZSBsb2FkZWRcbiAgICBPYmplY3Qua2V5cyhhc3NldHMuaW1hZ2VzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1trZXldID0gbmV3IEltYWdlKCk7XG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNba2V5XS5zcmMgPSBhc3NldHMuaW1hZ2VzW2tleV07XG4gICAgfSk7XG4gICAgT2JqZWN0LmtleXMoYXNzZXRzLmF1ZGlvKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuYXNzZXRzLmF1ZGlvW2tleV0gPSBuZXcgQXVkaW8oYXNzZXRzLmF1ZGlvW2tleV0pO1xuICAgIH0pO1xuXG4gICAgLy8gaW5pdGlhbGlzZSBkZWJ1ZyBjb250cm9sc1xuICAgIGlmICh0aGlzLmRlYnVnLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGlzZURlYnVnZ2VyTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGlzZSBjYW52YXNcbiAgICB0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKCk7XG4gICAgdGhpcy5jb250ZXh0ID0gUmVuZGVyVXRpbHMuZ2V0Q29udGV4dCh0aGlzLmNhbnZhcyk7XG5cbiAgICAvLyBhdHRhY2ggY2FudmFzIHRvIHVpXG4gICAgY29udGFpbmVyLmFwcGVuZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAvLyBnbyBmdWxsc2NyZWVuXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyB0aGlzLmNhbnZhcy5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgIH0pO1xuXG4gICAgLy8gaGFuZGxlIHRhYmJlZCBvdXQgc3RhdGVcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgICAgLy8gVE9ETyhzbWcpOiBwYXVzZSBmcmFtZSBleGVjdXRpb25cbiAgICAgICAgY29uc29sZS5sb2coJ3RhYiBpcyBhY3RpdmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE8oc21nKTogY29udGludWUgZnJhbWUgZXhlY3V0aW9uXG4gICAgICAgIGNvbnNvbGUubG9nKCd0YWIgaXMgaW5hY3RpdmUnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGluaXRpYWxpc2UgZ2FtZXBhZCBsaXN0ZW5lcnNcbiAgICB0aGlzLmludGlhbGlzZUdhbWVwYWRMaXN0ZW5lcnMoKTtcblxuICAgIC8vIGxvYWQgZmlyc3Qgc2NlbmVcbiAgICB0aGlzLmNoYW5nZVNjZW5lKHRoaXMuc2NlbmVzWzBdKTtcblxuICAgIC8vIFJ1biBnYW1lIGxvZ2ljXG4gICAgdGhpcy5mcmFtZSgwKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICAvLyBjcmVhdGUgY2FudmFzXG4gICAgY29uc3QgY2FudmFzID0gUmVuZGVyVXRpbHMuY3JlYXRlQ2FudmFzKCk7XG5cbiAgICAvLyBwcmV2ZW50IHJpZ2h0IGNsaWNrIG1lbnVcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgLy8gVE9ETyhzbWcpOiBuZWVkIHNvbWUgc29ydCBvZiBzY2VuZSBjbGFzcyBsaXN0IHR5cGVcbiAgY2hhbmdlU2NlbmUoc2NlbmVDbGFzczogU2NlbmVDb25zdHJ1Y3RvclNpZ25hdHVyZSk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFNjZW5lID0gUmVmbGVjdC5jb25zdHJ1Y3Qoc2NlbmVDbGFzcywgW3RoaXNdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbmUgZnJhbWUgb2YgZ2FtZSBsb2dpY1xuICAgKiBAcGFyYW0gdGltZXN0YW1wXG4gICAqL1xuICBwcml2YXRlIGZyYW1lKHRpbWVzdGFtcDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVidWcuYnJlYWtwb2ludC5mcmFtZSkge1xuICAgICAgZGVidWdnZXI7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWcudGltaW5nLmZyYW1lKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW2ZyYW1lXSAke3RoaXMuZGVsdGF9YCk7XG4gICAgfVxuXG4gICAgLy8gU2V0IERlbGF0YVxuICAgIHRoaXMuc2V0RGVsdGEodGltZXN0YW1wKTtcblxuICAgIC8vIENsZWFyIGNhbnZhcyBiZWZvcmUgcmVuZGVyXG4gICAgUmVuZGVyVXRpbHMuY2xlYXJDYW52YXModGhpcy5jb250ZXh0KTtcblxuICAgIC8vIHJ1biBmcmFtZSBsb2dpY1xuICAgIHRoaXMuY3VycmVudFNjZW5lLmZyYW1lKHRoaXMuZGVsdGEpO1xuXG4gICAgLy8gUmVuZGVyIHN0YXRzXG4gICAgaWYgKHRoaXMuZGVidWcuc3RhdHMuZnBzKSB7XG4gICAgICBpZiAodGhpcy5kZWJ1Zy5zdGF0cy5mcHNDb3VudGVyKSB7XG4gICAgICAgIHRoaXMucmVuZGVyU3RhdHMoMCwgJ0ZQUycsIGAke01hdGgucm91bmQoMTAwMCAvICgocGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLmRlYnVnLnN0YXRzLmZwc0NvdW50ZXIpKSl9IEZQU2ApO1xuICAgICAgfVxuICAgICAgdGhpcy5kZWJ1Zy5zdGF0cy5mcHNDb3VudGVyID0gdGltZXN0YW1wO1xuICAgIH1cbiAgICBpZiAodGhpcy5kZWJ1Zy5zdGF0cy5vYmplY3RDb3VudCkge1xuICAgICAgdGhpcy5yZW5kZXJTdGF0cygxLCAnT2JqZWN0cycsIGAke3RoaXMuY3VycmVudFNjZW5lLm9iamVjdHMubGVuZ3RofSBvYmplY3RzYCk7XG4gICAgfVxuXG4gICAgLy8gZGVidWcgZ3JpZFxuICAgIHRoaXMucmVuZGVyR3JpZCgpO1xuXG4gICAgLy8gY2hlY2sgZm9yIG1hcCBjaGFuZ2VcbiAgICBpZiAodGhpcy5jdXJyZW50U2NlbmUuZmxhZ2dlZEZvck1hcENoYW5nZSkge1xuICAgICAgdGhpcy5jdXJyZW50U2NlbmUuY2hhbmdlTWFwKHRoaXMuY3VycmVudFNjZW5lLmZsYWdnZWRGb3JNYXBDaGFuZ2UpO1xuICAgIH1cblxuICAgIC8vIENhbGwgbmV4dCBmcmFtZVxuICAgIC8vICh3ZSBzZXQgYHRoaXNgIGNvbnRleHQgZm9yIHdoZW4gdXNpbmcgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZnJhbWUuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSB0aW1lIHNpbmNlIHRoZSBwcmV2aW91cyBmcmFtZVxuICAgKiBAcGFyYW0gdGltZXN0YW1wXG4gICAqL1xuICBwcml2YXRlIHNldERlbHRhKHRpbWVzdGFtcDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5kZWx0YSA9ICh0aW1lc3RhbXAgLSB0aGlzLmxhc3RSZW5kZXJUaW1lc3RhbXApIC8gMTAwMDtcbiAgICB0aGlzLmxhc3RSZW5kZXJUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclN0YXRzKGluZGV4OiBudW1iZXIsIGxhYmVsOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJ3JlZCc7XG4gICAgdGhpcy5jb250ZXh0LmZvbnQgPSAnMTJweCBzZXJpZic7XG4gICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KHZhbHVlLCB0aGlzLkNBTlZBU19XSURUSCAtIDUwLCAoaW5kZXggKyAxKSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJHcmlkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRlYnVnLnVpLmdyaWQubGluZXMgfHwgdGhpcy5kZWJ1Zy51aS5ncmlkLm51bWJlcnMpIHtcbiAgICAgIFJlbmRlclV0aWxzLmZpbGxSZWN0YW5nbGUodGhpcy5jb250ZXh0LCAwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hULCB7IGNvbG91cjogJ3JnYmEoMCwgMCwgMCwgMC4yNSknLCB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Zy51aS5ncmlkLmxpbmVzKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuQ0FOVkFTX1dJRFRIOyB4ICs9IENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpIHtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLkNBTlZBU19IRUlHSFQ7IHkgKz0gQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkge1xuICAgICAgICAgIFJlbmRlclV0aWxzLnN0cm9rZVJlY3RhbmdsZSh0aGlzLmNvbnRleHQsIHgsIHksIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUsIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUsICdibGFjaycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWcudWkuZ3JpZC5udW1iZXJzKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSDsgeCsrKSB7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVDsgeSsrKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSAnOHB4IGhlbHZldGljYSc7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KGAke3h9YCwgKHggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSArIDEsICh5ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyA4KTsgLy8gOCBpcyA4IHB4XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KGAke3l9YCwgKHggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSArIDYsICh5ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyAxNCk7IC8vIDE2IGlzIDE2cHhcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGlzZURlYnVnZ2VyTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICBjYXNlICcxJzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnVpLmdyaWQubGluZXMgPSAhdGhpcy5kZWJ1Zy51aS5ncmlkLmxpbmVzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcyJzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnVpLmdyaWQubnVtYmVycyA9ICF0aGlzLmRlYnVnLnVpLmdyaWQubnVtYmVycztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnMyc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy5icmVha3BvaW50LmZyYW1lID0gIXRoaXMuZGVidWcuYnJlYWtwb2ludC5mcmFtZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnNCc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy5zdGF0cy5mcHMgPSAhdGhpcy5kZWJ1Zy5zdGF0cy5mcHM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzUnOlxuICAgICAgICAgIHRoaXMuZGVidWcuc3RhdHMub2JqZWN0Q291bnQgPSAhdGhpcy5kZWJ1Zy5zdGF0cy5vYmplY3RDb3VudDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnNic6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWUgPSAhdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzcnOlxuICAgICAgICAgIHRoaXMuZGVidWcudGltaW5nLmZyYW1lQmFja2dyb3VuZCA9ICF0aGlzLmRlYnVnLnRpbWluZy5mcmFtZUJhY2tncm91bmQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzgnOlxuICAgICAgICAgIHRoaXMuZGVidWcudGltaW5nLmZyYW1lUmVuZGVyID0gIXRoaXMuZGVidWcudGltaW5nLmZyYW1lUmVuZGVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc5JzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnRpbWluZy5mcmFtZVVwZGF0ZSA9ICF0aGlzLmRlYnVnLnRpbWluZy5mcmFtZVVwZGF0ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnMCc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy51aS5jYW52YXNMYXllcnMgPSAhdGhpcy5kZWJ1Zy51aS5jYW52YXNMYXllcnM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgIC8vIG5vdGhpbmcgeWV0XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgIC8vIG5vdGhpbmcgeWV0XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGludGlhbGlzZUdhbWVwYWRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2dhbWVwYWRjb25uZWN0ZWQnLCAoZXZlbnQ6IEdhbWVwYWRFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICdHYW1lcGFkIGNvbm5lY3RlZCBhdCBpbmRleCAlZDogJXMuICVkIGJ1dHRvbnMsICVkIGF4ZXMuJyxcbiAgICAgICAgZXZlbnQuZ2FtZXBhZC5pbmRleCxcbiAgICAgICAgZXZlbnQuZ2FtZXBhZC5pZCxcbiAgICAgICAgZXZlbnQuZ2FtZXBhZC5idXR0b25zLmxlbmd0aCxcbiAgICAgICAgZXZlbnQuZ2FtZXBhZC5heGVzLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIHRoaXMuZ2FtZXBhZCA9IGV2ZW50LmdhbWVwYWQ7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2dhbWVwYWRkaXNjb25uZWN0ZWQnLCAoZXZlbnQ6IEdhbWVwYWRFdmVudCkgPT4ge1xuICAgICAgdGhpcy5nYW1lcGFkID0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2FudmFzQ29uc3RhbnRzIHtcbiAgc3RhdGljIENBTlZBU19USUxFX0hFSUdIVCA9IDE4OyAvLyB0b3RhbCBoZWlnaHQgaW4gdGlsZXNcbiAgc3RhdGljIENBTlZBU19USUxFX1dJRFRIID0gMzA7IC8vIHRvdGFsIHdpZHRoIGluIHRpbGVzXG4gIHN0YXRpYyBUSUxFX1NJWkU6IG51bWJlciA9IDE2OyAvLyBlLmcuIDMyIG1lYW5zIGEgcGl4ZWwgc2l6ZSBvZiB0aWxlICgzMnB4IHggMzJweClcbiAgc3RhdGljIE9CSkVDVF9SRU5ERVJJTkdfTEFZRVJTOiBudW1iZXIgPSAxNjsgLy8gbnVtYmVyIG9mIGxheWVycyB0byByZW5kZXIgb2JqZWN0cyBvbi4gZS5nLiBmb3IgYSB2YWx1ZSBvZiAxNiwgMCBpcyB0aGUgbG93ZXN0IGxheWVyLCAxNSBpcyB0aGUgaGlnaGVzdFxuICBzdGF0aWMgT0JKRUNUX0NPTExJU0lPTl9MQVlFUlM6IG51bWJlciA9IDE2OyAvLyBudW1iZXIgb2YgbGF5ZXJzIG9uIHdoaWNoIG9iamVjdHMgY2FuIGNvbGxpZGUuIGUuZy4gZm9yIGEgdmFsdWUgb2YgMTYsIDAgaXMgdGhlIGxvd2VzdCBsYXllciwgMTUgaXMgdGhlIGhpZ2hlc3RcbiAgc3RhdGljIENPTlRFWFRfSU1BR0VfU01PT1RISU5HX0VOQUJMRUQ6IGJvb2xlYW4gPSBmYWxzZTsgLy8gd2hldGhlciB0byBlbmFibGUgaW1hZ2Ugc21vb3RoaW5nIG9uIHRoZSBjYW52YXMgY29udGV4dFxuXG4gIC8qKlxuICAgKiBLZWVwIGFuIGV5ZSBvbiB0aGlzIGFuZCBhbnkgZ2V0dGVycywgZG9uJ3QgcnVuIGl0IG9uIGhvdCBjb2RlIHBhdGhzXG4gICAqL1xuICBzdGF0aWMgZ2V0IENBTlZBU19IRUlHSFQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAqIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQ7XG4gIH1cblxuICBzdGF0aWMgZ2V0IENBTlZBU19XSURUSCgpOiBudW1iZXIge1xuICAgIHJldHVybiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFICogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIO1xuICB9XG5cbiAgc3RhdGljIGdldCBBU1BFQ1RfUkFUSU8oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAvIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGF5ZXIgdGhhdCBVSSBlbGVtZW50cyBzaG91bGQgYmUgcmVuZGVyZWQgb25cbiAgICovXG4gIHN0YXRpYyBnZXQgVUlfUkVOREVSX0xBWUVSKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENhbnZhc0NvbnN0YW50cy5PQkpFQ1RfUkVOREVSSU5HX0xBWUVSUyAtIDE7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbGxpc2lvbiBsYXllciBmb3IgVUkgZWxlbWVudHMgc28gdGhhdCBnYW1lIGVsZW1lbnRzIGRvbid0IGludGVyYWN0IHdpdGggdGhlbVxuICAgKi9cbiAgc3RhdGljIGdldCBVSV9DT0xMSVNJT05fTEFZRVIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLk9CSkVDVF9DT0xMSVNJT05fTEFZRVJTIC0gMTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgQ0FOVkFTX0NFTlRFUl9USUxFX1koKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5DQU5WQVNfVElMRV9IRUlHSFQgLyAyO1xuICB9XG5cbiAgc3RhdGljIGdldCBDQU5WQVNfQ0VOVEVSX1RJTEVfWCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLkNBTlZBU19USUxFX1dJRFRIIC8gMjtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgQ0FOVkFTX0NFTlRFUl9QSVhFTF9YKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfV0lEVEggLyAyO1xuICB9XG5cbiAgc3RhdGljIGdldCBDQU5WQVNfQ0VOVEVSX1BJWEVMX1koKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19IRUlHSFQgLyAyO1xuICB9XG59XG4iLCJpbXBvcnQgeyB0eXBlIEFzc2V0cyB9IGZyb20gJy4vYXNzZXRzJztcbmltcG9ydCB7IHR5cGUgQmFja2dyb3VuZExheWVyIH0gZnJvbSAnLi9iYWNrZ3JvdW5kLWxheWVyJztcbmltcG9ydCB7IHR5cGUgU2NlbmUgfSBmcm9tICcuL3NjZW5lJztcbmltcG9ydCB7IHR5cGUgU2NlbmVPYmplY3QgfSBmcm9tICcuL3NjZW5lLW9iamVjdCc7XG5cbmV4cG9ydCB0eXBlIFNjZW5lTWFwQ29uc3RydWN0b3JTaWduYXR1cmUgPSBuZXcgKGNsaWVudDogU2NlbmUpID0+IFNjZW5lTWFwO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2NlbmVNYXAge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYmFja2dyb3VuZExheWVyczogQmFja2dyb3VuZExheWVyW107XG4gIG9iamVjdHM6IFNjZW5lT2JqZWN0W107XG4gIGdsb2JhbHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICBwcm90ZWN0ZWQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcm90ZWN0ZWQgYXNzZXRzOiBBc3NldHM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHNjZW5lOiBTY2VuZVxuICApIHtcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLnNjZW5lLmNvbnRleHQ7XG4gICAgdGhpcy5hc3NldHMgPSB0aGlzLnNjZW5lLmFzc2V0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbWFwIGlzIGRlc3Ryb3llZFxuICAgKi9cbiAgZGVzdHJveT8oKTogdm9pZCB7XG4gICAgLy8gZG8gbm90aGluZyBieSBkZWZhdWx0XG4gIH1cbn1cbiIsImltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IHR5cGUgU2NlbmUgfSBmcm9tICcuL3NjZW5lJztcbmltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgQXNzZXRzIH0gZnJvbSAnLi9hc3NldHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBvc2l0aW9uWD86IG51bWJlcjtcbiAgcG9zaXRpb25ZPzogbnVtYmVyO1xuICB0YXJnZXRYPzogbnVtYmVyO1xuICB0YXJnZXRZPzogbnVtYmVyO1xuXG4gIGlzUmVuZGVyYWJsZT86IGJvb2xlYW47XG4gIHJlbmRlckxheWVyPzogbnVtYmVyO1xuICByZW5kZXJPcGFjaXR5PzogbnVtYmVyO1xuICByZW5kZXJTY2FsZT86IG51bWJlcjtcblxuICBoYXNDb2xsaXNpb24/OiBib29sZWFuO1xuICBjb2xsaXNpb25MYXllcj86IG51bWJlcjtcbn1cblxuY29uc3QgREVGQVVMVF9JU19SRU5ERVJBQkxFOiBib29sZWFuID0gZmFsc2U7XG5jb25zdCBERUZBVUxUX1JFTkRFUl9MQVlFUjogbnVtYmVyID0gMDtcbmNvbnN0IERFRkFVTFRfUkVOREVSX09QQUNJVFk6IG51bWJlciA9IDE7XG5jb25zdCBERUZBVUxUX1JFTkRFUl9TQ0FMRTogbnVtYmVyID0gMTtcblxuY29uc3QgREVGQVVMVF9IQVNfQ09MTElTSU9OOiBib29sZWFuID0gZmFsc2U7XG5jb25zdCBERUZBVUxUX0NPTExJU0lPTl9MQVlFUjogbnVtYmVyID0gMDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjZW5lT2JqZWN0IHtcbiAgaWQ6IHN0cmluZyA9IGNyeXB0by5yYW5kb21VVUlEKCk7XG5cbiAgLy8gcG9zaXRpb25cbiAgcG9zaXRpb25YOiBudW1iZXIgPSAtMTtcbiAgcG9zaXRpb25ZOiBudW1iZXIgPSAtMTtcbiAgdGFyZ2V0WDogbnVtYmVyID0gLTE7XG4gIHRhcmdldFk6IG51bWJlciA9IC0xO1xuXG4gIC8vIGRpbWVuc2lvbnNcbiAgd2lkdGg6IG51bWJlciA9IDE7XG4gIGhlaWdodDogbnVtYmVyID0gMTtcblxuICAvLyBjb2xsaXNpb25cbiAgaGFzQ29sbGlzaW9uOiBib29sZWFuO1xuICBjb2xsaXNpb25MYXllcjogbnVtYmVyO1xuXG4gIC8vIHJlbmRlcmluZ1xuICBpc1JlbmRlcmFibGU6IGJvb2xlYW47XG4gIHJlbmRlckxheWVyOiBudW1iZXI7XG4gIHJlbmRlck9wYWNpdHk6IG51bWJlcjsgLy8gdGhlIG9wYWNpdHkgb2YgdGhlIG9iamVjdCB3aGVuIHJlbmRlcmVkICh2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEpXG4gIHJlbmRlclNjYWxlOiBudW1iZXI7IC8vIHRoZSBzY2FsZSBvZiB0aGUgb2JqZWN0IHdoZW4gcmVuZGVyZWRcblxuICAvLyBUT0RPKHNtZyk6IEknbSBub3QgY29udmluY2VkIG9mIHRoaXMgYnV0IEkgd2lsbCBnbyB3aXRoIGl0IGZvciBub3dcbiAga2V5TGlzdGVuZXJzOiBSZWNvcmQ8c3RyaW5nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+ID0ge307IC8vIGZvciBrZXlib2FyZCBldmVudHNcbiAgZXZlbnRMaXN0ZW5lcnM6IFJlY29yZDxzdHJpbmcsIChldmVudDogQ3VzdG9tRXZlbnQpID0+IHZvaWQ+ID0ge307IC8vIGZvciBzY2VuZSBldmVudHNcblxuICBwcm90ZWN0ZWQgbWFpbkNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJvdGVjdGVkIGFzc2V0czogQXNzZXRzO1xuXG4gIC8vIGZsYWdzXG4gIGZsYWdnZWRGb3JSZW5kZXI6IGJvb2xlYW4gPSB0cnVlOyAvLyBUT0RPKHNtZyk6IGltcGxlbWVudCB0aGUgdXNhZ2Ugb2YgdGhpcyBmbGFnIHRvIGltcHJvdmUgZW5naW5lIHBlcmZvcm1hbmNlXG4gIGZsYWdnZWRGb3JVcGRhdGU6IGJvb2xlYW4gPSB0cnVlOyAvLyBUT0RPKHNtZyk6IGltcGxlbWVudCB0aGUgdXNhZ2Ugb2YgdGhpcyBmbGFnIHRvIGltcHJvdmUgZW5naW5lIHBlcmZvcm1hbmNlXG4gIGZsYWdnZWRGb3JEZXN0cm95OiBib29sZWFuID0gZmFsc2U7IC8vIFRPRE8oc21nKTogaW1wbGVtZW50IHRoaXMuIHVzZWQgdG8gcmVtb3ZlIG9iamVjdCBmcm9tIHNjZW5lIG9uIG5leHQgdXBkYXRlIHJhdGhlciB0aGFuIG1pZCB1cGRhdGUgZXRjXG5cbiAgLy8gVE9ETyhzbWcpOiBDdXJyZW50bHkgd2UgYXJlIHVzaW5nIHBvc2l0aW9uWCBhbmQgcG9zaXRpb25ZIGFzIHRoZSB0b3AgbGVmdCBjb3JuZXIgb2YgdGhlIG9iamVjdFxuICAvLyBib3VuZGluZ1ggYW5kIGJvdW5kaW5nWSBhcmUgdGhlIGJvdHRvbSByaWdodCBjb3JuZXIgb2YgdGhlIG9iamVjdFxuICAvLyBJIHdhbnQgdG8gY2hhbmdlIHRoaXMgc28gdGhhdCBwb3NpdGlvblggYW5kIHBvc2l0aW9uWSBhcmUgdGhlIGNlbnRlciBvZiB0aGUgb2JqZWN0IChvciB3aGF0ZXZlciB0aGUgdXNlciB3YW50cyBpdCB0byBiZSlcbiAgLy8gSSBhdCBsZWFzdCB3YW50IGl0IHRvIGJlIGNvbmZpZ3VyYWJsZS5cbiAgLy8gYm91bmRpbmdCb3ggc2hvdWxkIHRoZW4gYmUgdXNlZCBmb3IgYWxsIGNvbGxpc2lvbnMgYW5kIGJlIGJhc2VkIG9mZiBvZiBwb3NpdGlvblggYW5kIHBvc2l0aW9uWSBhbmQgd2lkdGggYW5kIGhlaWdodFxuICAvLyBlLmcuIHBvc2l0aW9uWCA9IDUgYW5kIHBvc2l0aW9uIFkgPSAxMCwgd2lkdGggYW5kIGhlaWdodCA9IDIgd291bGQgbWVhbiB0aGUgYm91bmRpbmcgYm94IGlzXG4gIC8vIHRvcDogOSwgKDEwIC0gKDIgLyAyKSA9IDkpXG4gIC8vIHJpZ2h0OiA2LCAoNSArICgyIC8gMikgPSA2KVxuICAvLyBib3R0b206IDExLCAoMTAgKyAoMiAvIDIpID0gMTFcbiAgLy8gbGVmdDogNCAoNSAtICgyIC8gMikgPSA0XG5cbiAgLy8gVE9ETyhzbWcpOiB0aGlzIGJlaW5nIGEgZ2V0dGVyIHByb2JhYmx5IGlzIHF1aXRlIHNsb3cgaWYgaXQncyB1c2VkIGEgbG90IGJ1dCBpdCdzIGZpbmUgZm9yIG5vd1xuICBnZXQgYm91bmRpbmdCb3goKToge1xuICAgIHRvcDogbnVtYmVyO1xuICAgIHJpZ2h0OiBudW1iZXI7XG4gICAgYm90dG9tOiBudW1iZXI7XG4gICAgbGVmdDogbnVtYmVyO1xuICB9IHtcbiAgICBsZXQgeE9mZnNldCA9IHRoaXMud2lkdGggLyAyOyAvLyBUT0RPKHNtZyk6IHRoaXMgc2hvdWxkIGJlIGNhbGN1bGF0ZWQgYmFzZWQgb2ZmIG9mIGhvdyB0aGUgdXNlciB3YW50cyB0aGUgcG9zaXRpb24gdG8gYmUgY2FsY3VsYXRlZFxuICAgIGxldCB5T2Zmc2V0ID0gdGhpcy5oZWlnaHQgLyAyOyAvLyBUT0RPKHNtZyk6IHNhbWUgYXMgYWJvdmVcblxuICAgIC8vIHJldHVybiB7XG4gICAgLy8gICB0b3A6IHRoaXMucG9zaXRpb25ZIC0geU9mZnNldCxcbiAgICAvLyAgIHJpZ2h0OiB0aGlzLnBvc2l0aW9uWCArIHhPZmZzZXQsXG4gICAgLy8gICBib3R0b206IHRoaXMucG9zaXRpb25ZICsgeU9mZnNldCxcbiAgICAvLyAgIGxlZnQ6IHRoaXMucG9zaXRpb25YIC0geE9mZnNldCxcbiAgICAvLyB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogdGhpcy5wb3NpdGlvblksXG4gICAgICByaWdodDogdGhpcy5wb3NpdGlvblggKyB0aGlzLndpZHRoLFxuICAgICAgYm90dG9tOiB0aGlzLnBvc2l0aW9uWSArIHRoaXMuaGVpZ2h0LFxuICAgICAgbGVmdDogdGhpcy5wb3NpdGlvblgsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBzY2VuZTogU2NlbmUsXG4gICAgY29uZmlnOiBTY2VuZU9iamVjdEJhc2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5tYWluQ29udGV4dCA9IHRoaXMuc2NlbmUuY29udGV4dDtcbiAgICB0aGlzLmFzc2V0cyA9IHRoaXMuc2NlbmUuYXNzZXRzO1xuXG4gICAgLy8gcG9zaXRpb24gZGVmYXVsdFxuICAgIGlmIChjb25maWcucG9zaXRpb25YICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucG9zaXRpb25YID0gY29uZmlnLnBvc2l0aW9uWDtcbiAgICAgIGlmIChjb25maWcudGFyZ2V0WCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0WCA9IHRoaXMucG9zaXRpb25YO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb25maWcucG9zaXRpb25ZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucG9zaXRpb25ZID0gY29uZmlnLnBvc2l0aW9uWTtcbiAgICAgIGlmIChjb25maWcudGFyZ2V0WSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0WSA9IHRoaXMucG9zaXRpb25ZO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb25maWcudGFyZ2V0WCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRhcmdldFggPSBjb25maWcudGFyZ2V0WDtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnRhcmdldFkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50YXJnZXRZID0gY29uZmlnLnRhcmdldFk7XG4gICAgfVxuXG4gICAgdGhpcy5pc1JlbmRlcmFibGUgPSBjb25maWcuaXNSZW5kZXJhYmxlID8/IERFRkFVTFRfSVNfUkVOREVSQUJMRTtcbiAgICB0aGlzLnJlbmRlckxheWVyID0gY29uZmlnLnJlbmRlckxheWVyID8/IERFRkFVTFRfUkVOREVSX0xBWUVSO1xuICAgIHRoaXMucmVuZGVyT3BhY2l0eSA9IGNvbmZpZy5yZW5kZXJPcGFjaXR5ID8/IERFRkFVTFRfUkVOREVSX09QQUNJVFk7XG5cbiAgICB0aGlzLmhhc0NvbGxpc2lvbiA9IGNvbmZpZy5oYXNDb2xsaXNpb24gPz8gREVGQVVMVF9IQVNfQ09MTElTSU9OO1xuICAgIHRoaXMuY29sbGlzaW9uTGF5ZXIgPSBjb25maWcuY29sbGlzaW9uTGF5ZXIgPz8gREVGQVVMVF9DT0xMSVNJT05fTEFZRVI7XG4gICAgdGhpcy5yZW5kZXJTY2FsZSA9IGNvbmZpZy5yZW5kZXJTY2FsZSA/PyBERUZBVUxUX1JFTkRFUl9TQ0FMRTtcbiAgfVxuXG4gIHVwZGF0ZT8oZGVsdGE6IG51bWJlcik6IHZvaWQ7XG4gIHJlbmRlcj8oY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZDtcbiAgZGVzdHJveT8oKTogdm9pZDtcblxuICAvKipcbiAgICogVXNlZCBmb3IgZGVidWdnaW5nXG4gICAqIEBwYXJhbSBjb250ZXh0XG4gICAqL1xuICBkZWJ1Z2dlclJlbmRlckJvdW5kYXJ5KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIFJlbmRlclV0aWxzLnN0cm9rZVJlY3RhbmdsZShcbiAgICAgIGNvbnRleHQsXG4gICAgICBNYXRoLmZsb29yKHRoaXMuYm91bmRpbmdCb3gubGVmdCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLmJvdW5kaW5nQm94LnRvcCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLndpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksXG4gICAgICBNYXRoLmZsb29yKHRoaXMuaGVpZ2h0ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksXG4gICAgICAncmVkJ1xuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBmb3IgZGVidWdnaW5nXG4gICAqIEBwYXJhbSBjb250ZXh0XG4gICAqL1xuICBkZWJ1Z2dlclJlbmRlckJhY2tncm91bmQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgUmVuZGVyVXRpbHMuZmlsbFJlY3RhbmdsZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLmJvdW5kaW5nQm94LmxlZnQsXG4gICAgICB0aGlzLmJvdW5kaW5nQm94LnRvcCxcbiAgICAgIE1hdGguZmxvb3IodGhpcy53aWR0aCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLmhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgeyBjb2xvdXI6ICdyZWQnLCB9XG4gICAgKTtcbiAgfVxuXG4gIGdldCBjYW1lcmFSZWxhdGl2ZVBvc2l0aW9uWCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uWCArIHRoaXMuc2NlbmUuZ2xvYmFscy5jYW1lcmEuc3RhcnRYO1xuICB9XG5cbiAgZ2V0IGNhbWVyYVJlbGF0aXZlUG9zaXRpb25ZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25ZICsgdGhpcy5zY2VuZS5nbG9iYWxzLmNhbWVyYS5zdGFydFk7XG4gIH1cblxuICBnZXQgcGl4ZWxXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgfVxuXG4gIGdldCBwaXhlbEhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkU7XG4gIH1cblxuICBpc0NvbGxpZGluZ1dpdGgob2JqZWN0OiBTY2VuZU9iamVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzV2l0aGluSG9yaXpvbnRhbEJvdW5kcyhvYmplY3QpICYmIHRoaXMuaXNXaXRoaW5WZXJ0aWNhbEJvdW5kcyhvYmplY3QpO1xuICB9XG5cbiAgaXNXaXRoaW5Ib3Jpem9udGFsQm91bmRzKG9iamVjdDogU2NlbmVPYmplY3QpOiBib29sZWFuIHtcbiAgICBpZiAob2JqZWN0LmJvdW5kaW5nQm94LmxlZnQgPj0gdGhpcy5ib3VuZGluZ0JveC5sZWZ0ICYmIG9iamVjdC5ib3VuZGluZ0JveC5sZWZ0IDw9IHRoaXMuYm91bmRpbmdCb3gucmlnaHQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChvYmplY3QuYm91bmRpbmdCb3gucmlnaHQgPj0gdGhpcy5ib3VuZGluZ0JveC5sZWZ0ICYmIG9iamVjdC5ib3VuZGluZ0JveC5yaWdodCA8PSB0aGlzLmJvdW5kaW5nQm94LnJpZ2h0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1dpdGhpblZlcnRpY2FsQm91bmRzKG9iamVjdDogU2NlbmVPYmplY3QpOiBib29sZWFuIHtcbiAgICBpZiAob2JqZWN0LmJvdW5kaW5nQm94LnRvcCA+PSB0aGlzLmJvdW5kaW5nQm94LnRvcCAmJiBvYmplY3QuYm91bmRpbmdCb3gudG9wIDw9IHRoaXMuYm91bmRpbmdCb3guYm90dG9tKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAob2JqZWN0LmJvdW5kaW5nQm94LmJvdHRvbSA+PSB0aGlzLmJvdW5kaW5nQm94LnRvcCAmJiBvYmplY3QuYm91bmRpbmdCb3guYm90dG9tIDw9IHRoaXMuYm91bmRpbmdCb3guYm90dG9tKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IHR5cGUgQmFja2dyb3VuZExheWVyIH0gZnJvbSAnLi9iYWNrZ3JvdW5kLWxheWVyJztcbmltcG9ydCB7IHR5cGUgU2NlbmVNYXBDb25zdHJ1Y3RvclNpZ25hdHVyZSwgdHlwZSBTY2VuZU1hcCB9IGZyb20gJy4vc2NlbmUtbWFwJztcbmltcG9ydCB7IHR5cGUgU2NlbmVPYmplY3QgfSBmcm9tICcuL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBNb3VzZVV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvbW91c2UudXRpbHMnO1xuaW1wb3J0IHsgdHlwZSBDbGllbnQgfSBmcm9tICdAY29yZS9jbGllbnQnO1xuaW1wb3J0IHsgdHlwZSBBc3NldHMgfSBmcm9tICcuL2Fzc2V0cyc7XG5cbmV4cG9ydCB0eXBlIFNjZW5lQ29uc3RydWN0b3JTaWduYXR1cmUgPSBuZXcgKGNsaWVudDogQ2xpZW50KSA9PiBTY2VuZTtcblxuZXhwb3J0IGludGVyZmFjZSBTY2VuZVJlbmRlcmluZ0NvbnRleHQge1xuICBiYWNrZ3JvdW5kOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkRbXTtcbiAgb2JqZWN0czogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NlbmVHbG9iYWxzQmFzZUNvbmZpZyB7XG4gIG1vdXNlOiB7XG4gICAgY2xpY2s6IHtcbiAgICAgIGxlZnQ6IGJvb2xlYW47XG4gICAgICBtaWRkbGU6IGJvb2xlYW47XG4gICAgICByaWdodDogYm9vbGVhbjtcbiAgICB9O1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiBudW1iZXI7XG4gICAgICB5OiBudW1iZXI7XG4gICAgICBleGFjdFg6IG51bWJlcjsgLy8gbm90IHJvdW5kZWQgdG8gdGlsZVxuICAgICAgZXhhY3RZOiBudW1iZXI7IC8vIG5vdCByb3VuZGVkIHRvIHRpbGVcbiAgICB9O1xuICB9O1xuXG4gIGtleWJvYXJkOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPjtcblxuICAvLyBUT0RPKHNtZyk6IGNhbWVyYVBvc2l0aW9uIGlzIHJlZmVycmluZyB0byBjdXN0b21SZW5kZXJlciwgcGVyaGFwcyByZW5hbWUgY3VzdG9tUmVuZGVyZXIgdG8gY2FtZXJhP1xuICBjYW1lcmE6IHtcbiAgICBzdGFydFg6IG51bWJlcjtcbiAgICBzdGFydFk6IG51bWJlcjtcbiAgICBlbmRYOiBudW1iZXI7XG4gICAgZW5kWTogbnVtYmVyO1xuICB9O1xuICBsYXRlc3RNb3VzZUV2ZW50OiBNb3VzZUV2ZW50O1xufVxuXG5leHBvcnQgdHlwZSBDdXN0b21SZW5kZXJlclNpZ25hdHVyZSA9IChyZW5kZXJpbmdDb250ZXh0OiBTY2VuZVJlbmRlcmluZ0NvbnRleHQpID0+IHZvaWQ7XG4vKipcblxuICBhZGRpbmcgYSBxdWljayBkZXNjcmlwdGlvbiBoZXJlIGFzIHRoaXMgc2hhcGUgaXMgcHJldHR5IGdyb3NzIGJ1dCBJIHRoaW5rIGl0IHdpbGwgYmUgc29tZXdoYXQgcGVyZm9ybWFudCBhdCBzY2FsZVxuICB3aGVyZSA8bnVtYmVyPiBmcm9tIGxlZnQgdG8gcmlnaHQgaXMsIDxzY2VuZSBpbmRleD4sIDx4IHBvc2l0aW9uPiwgPHkgcG9zaXRpb24+LCA8YW5pbWF0aW9uIHRpbWVyIGluIHNlY29uZHM+XG5cbiAgYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyOiBSZWNvcmQ8bnVtYmVyLCBSZWNvcmQ8bnVtYmVyLCBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+Pj5cbiAgYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyID0ge1xuICAgIDA6IHtcbiAgICAgIDA6IHtcbiAgICAgICAgMDogMFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4qL1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2NlbmUge1xuICAvLyBiYWNrZ3JvdW5kXG4gIGJhY2tncm91bmRMYXllcnM6IEJhY2tncm91bmRMYXllcltdO1xuICBiYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXI6IFJlY29yZDxudW1iZXIsIFJlY29yZDxudW1iZXIsIFJlY29yZDxudW1iZXIsIG51bWJlcj4+PiA9IHt9OyAvLyB1c2VkIGZvciB0aW1pbmdzIGZvciBiYWNrZ3JvdW5kIGxheWVyIGFuaW1hdGlvbnNcblxuICAvLyBvYmplY3RzXG4gIG9iamVjdHM6IFNjZW5lT2JqZWN0W10gPSBbXTtcbiAgLy8gVE9ETyhzbWcpOiBob3cgZG8gd2UgYWNjZXNzIHR5cGVzIGZvciB0aGlzIGZyb20gdGhlIHNjZW5lIG9iamVjdD9cblxuICAvLyBhIHBsYWNlIHRvIHN0b3JlIGZsYWdzIGZvciB0aGUgc2NlbmVcbiAgcmVhZG9ubHkgZ2xvYmFsczogU2NlbmVHbG9iYWxzQmFzZUNvbmZpZyA9IHtcbiAgICBtb3VzZToge1xuICAgICAgY2xpY2s6IHtcbiAgICAgICAgbGVmdDogZmFsc2UsXG4gICAgICAgIG1pZGRsZTogZmFsc2UsXG4gICAgICAgIHJpZ2h0OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICBleGFjdFg6IDAsXG4gICAgICAgIGV4YWN0WTogMCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjYW1lcmE6IHtcbiAgICAgIHN0YXJ0WDogMCxcbiAgICAgIHN0YXJ0WTogMCxcbiAgICAgIGVuZFg6IDAsXG4gICAgICBlbmRZOiAwLFxuICAgIH0sXG4gICAga2V5Ym9hcmQ6IHt9LFxuICAgIGxhdGVzdE1vdXNlRXZlbnQ6IG5ldyBNb3VzZUV2ZW50KCcnKSxcbiAgfTtcblxuICAvLyBtYXBzXG4gIC8vIFRPRE8oc21nKTogY2hhbmdlIHRoaXMgc28geW91IGNhbiBwYXNzIGluIGEgbWFwIGNsYXNzIGRpcmVjdGx5IGFuZCB0aGUgdHlwZSB1c2VzIFNjZW5lTWFwQ29uc3RydWN0b3JTaWduYXR1cmUgfCB1bmRlZmluZWRcbiAgZmxhZ2dlZEZvck1hcENoYW5nZTogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkOyAvLyBpZiB0aGlzIGlzIHNldCwgdGhlIHNjZW5lIHdpbGwgY2hhbmdlIHRvIHRoZSBtYXAgYXQgdGhlIHByb3ZpZGVkIGluZGV4IG9uIHRoZSBuZXh0IGZyYW1lXG4gIG1hcHM6IFNjZW5lTWFwQ29uc3RydWN0b3JTaWduYXR1cmVbXSA9IFtdOyAvLyBUT0RPKHNtZyk6IHNvbWUgc29ydCBvZiBiZXR0ZXIgdHlwaW5nIGZvciB0aGlzLCBpdCBpcyBhIGxpc3Qgb2YgdW5pbnN0YW5jaWF0ZWQgY2xhc3NlcyB0aGF0IGV4dGVuZCBTY2VuZU1hcFxuICBtYXA6IFNjZW5lTWFwOyAvLyB0aGUgY3VycmVudCBtYXBcblxuICAvLyByZW5kZXJpbmcgY29udGV4dHNcbiAgcmVuZGVyaW5nQ29udGV4dDogU2NlbmVSZW5kZXJpbmdDb250ZXh0ID0ge1xuICAgIGJhY2tncm91bmQ6IFtdLFxuICAgIG9iamVjdHM6IFtdLFxuICB9O1xuXG4gIC8vIGZvciBmaXJpbmcgZXZlbnRzXG4gIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRFbWl0dGVyOiBFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZXZlbnRFbWl0dGVyJyk7XG4gIHJlYWRvbmx5IGV2ZW50VHlwZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTsgLy8gVE9ETyhzbWcpOiBzb21lIHdheSB0eXBpbmcgdGhpcyBzbyB0aGVyZSBpcyBpbnRlbGxpc2Vuc2UgZm9yIGV2ZW50IHR5cGVzIGZvciBhIHNjZW5lXG5cbiAgcHJpdmF0ZSBjdXN0b21SZW5kZXJlcj86IEN1c3RvbVJlbmRlcmVyU2lnbmF0dXJlO1xuXG4gIC8vIGZyb20gY2xpZW50XG4gIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgYXNzZXRzOiBBc3NldHM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGNsaWVudDogQ2xpZW50XG4gICkge1xuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2xpZW50LmNvbnRleHQ7XG4gICAgdGhpcy5hc3NldHMgPSB0aGlzLmNsaWVudC5hc3NldHM7XG5cbiAgICAvLyBzZXQgdXAgbW91c2UgbGlzdGVuZXJcbiAgICBjbGllbnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLnBvc2l0aW9uID0gTW91c2VVdGlscy5nZXRNb3VzZVBvc2l0aW9uKGNsaWVudC5jYW52YXMsIGV2ZW50KTtcbiAgICAgIHRoaXMuZ2xvYmFscy5sYXRlc3RNb3VzZUV2ZW50ID0gZXZlbnQ7XG4gICAgfSk7XG5cbiAgICAvLyBtb3VzZVxuICAgIGNsaWVudC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnW21vdXNlZG93bl0nLCBldmVudCk7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmJ1dHRvbikge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLm1pZGRsZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2sucmlnaHQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2xpZW50LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnW21vdXNldXBdJywgZXZlbnQpO1xuICAgICAgc3dpdGNoIChldmVudC5idXR0b24pIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2subWlkZGxlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2sucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHRvdWNoXG4gICAgY2xpZW50LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnW3RvdWNoc3RhcnRdJywgZXZlbnQpO1xuICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgY2xpZW50LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1t0b3VjaGVuZF0nLCBldmVudCk7XG4gICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnJlcGVhdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygnW2tleWRvd25dJywgZXZlbnQpO1xuICAgICAgdGhpcy5nbG9iYWxzLmtleWJvYXJkW2V2ZW50LmtleS50b0xvY2FsZUxvd2VyQ2FzZSgpXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnJlcGVhdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdba2V5dXBdJywgZXZlbnQpO1xuICAgICAgdGhpcy5nbG9iYWxzLmtleWJvYXJkW2V2ZW50LmtleS50b0xvY2FsZUxvd2VyQ2FzZSgpXSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgYmFja2dyb3VuZExheWVyQW5pbWF0aW9uRnJhbWU6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcblxuICAvLyBUT0RPKHNtZyk6IG1vdmUgY2xpZW50IHJlbmRlcmluZyBjb2RlIGludG8gaGVyZVxuICBmcmFtZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJCYWNrZ3JvdW5kKGRlbHRhKTtcbiAgICB0aGlzLnVwZGF0ZU9iamVjdHMoZGVsdGEpO1xuICAgIHRoaXMucmVuZGVyT2JqZWN0cyhkZWx0YSk7XG5cbiAgICBpZiAodGhpcy5jdXN0b21SZW5kZXJlcikge1xuICAgICAgdGhpcy5jdXN0b21SZW5kZXJlcih0aGlzLnJlbmRlcmluZ0NvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlZmF1bHRSZW5kZXJlcigpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckJhY2tncm91bmQoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy50aW1pbmcuZnJhbWVCYWNrZ3JvdW5kKSB7XG4gICAgICBjb25zb2xlLnRpbWUoJ1tmcmFtZV0gYmFja2dyb3VuZCcpO1xuICAgIH1cblxuICAgIHRoaXMuYmFja2dyb3VuZExheWVycy5mb3JFYWNoKChsYXllciwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcy5yZW5kZXJpbmdDb250ZXh0LmJhY2tncm91bmRbaW5kZXhdO1xuICAgICAgUmVuZGVyVXRpbHMuY2xlYXJDYW52YXMoY29udGV4dCk7XG5cbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5tYXAud2lkdGg7IHgrKykge1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMubWFwLmhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgbGV0IHRpbGUgPSBsYXllci50aWxlc1t4XSA/IGxheWVyLnRpbGVzW3hdW3ldIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgaWYgKHRpbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGFuaW1hdGlvbkZyYW1lO1xuICAgICAgICAgIGlmICh0aWxlLmFuaW1hdGlvbkZyYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIHNraXAgYW5pbWF0aW9ucyBpZiBvbmx5IDEgc3ByaXRlXG4gICAgICAgICAgICBhbmltYXRpb25GcmFtZSA9IHRpbGUuYW5pbWF0aW9uRnJhbWVzWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aW1lciBoYXMgc3RhcnRlZCBmb3Igc3BlY2lmaWMgdGlsZSBvbiBzcGVjaWZpYyBsYXllclxuICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyW2xheWVyLmluZGV4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyW2xheWVyLmluZGV4XSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXJbbGF5ZXIuaW5kZXhdW3hdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXJbbGF5ZXIuaW5kZXhdW3hdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0aW1lcjtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcltsYXllci5pbmRleF1beF1beV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0aW1lciA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aW1lciA9IHRoaXMuYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyW2xheWVyLmluZGV4XVt4XVt5XSArIGRlbHRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB3cmFwIHRpbWVyIGlmIG92ZXIgYW5pbWF0aW9uIGZyYW1lIGR1cmF0aW9uXG4gICAgICAgICAgICBpZiAodGltZXIgPiB0aWxlLmFuaW1hdGlvbkZyYW1lRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgdGltZXIgPSB0aW1lciAlIHRpbGUuYW5pbWF0aW9uRnJhbWVEdXJhdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlLmFuaW1hdGlvbk1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAodGltZXIgPD0gdGlsZS5hbmltYXRpb25NYXBbaV0pIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25GcmFtZSA9IHRpbGUuYW5pbWF0aW9uRnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyW2xheWVyLmluZGV4XVt4XVt5XSA9IHRpbWVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbdGlsZS50aWxlc2V0XSxcbiAgICAgICAgICAgIGFuaW1hdGlvbkZyYW1lLnNwcml0ZVgsXG4gICAgICAgICAgICBhbmltYXRpb25GcmFtZS5zcHJpdGVZLFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcudGltaW5nLmZyYW1lQmFja2dyb3VuZCkge1xuICAgICAgY29uc29sZS50aW1lRW5kKCdbZnJhbWVdIGJhY2tncm91bmQnKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVPYmplY3RzKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcudGltaW5nLmZyYW1lVXBkYXRlKSB7XG4gICAgICBjb25zb2xlLnRpbWUoJ1tmcmFtZV0gdXBkYXRlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5vYmplY3RzLmZvckVhY2goKG9iamVjdCkgPT4ge1xuICAgICAgaWYgKG9iamVjdC51cGRhdGUpIHtcbiAgICAgICAgb2JqZWN0LnVwZGF0ZShkZWx0YSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcudGltaW5nLmZyYW1lVXBkYXRlKSB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ1tmcmFtZV0gdXBkYXRlJyk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyT2JqZWN0cyhkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLnRpbWluZy5mcmFtZVJlbmRlcikge1xuICAgICAgY29uc29sZS50aW1lKCdbZnJhbWVdIHJlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIGNsZWFyIG9iamVjdCBjYW52YXNlc1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5vYmplY3RzLmZvckVhY2goKGNvbnRleHQpID0+IHtcbiAgICAgIFJlbmRlclV0aWxzLmNsZWFyQ2FudmFzKGNvbnRleHQpO1xuICAgIH0pO1xuXG4gICAgLy8gcmVuZGVyIG9iamVjdHNcbiAgICB0aGlzLm9iamVjdHMuZm9yRWFjaCgob2JqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5jbGllbnQuZGVidWcub2JqZWN0LnJlbmRlckJhY2tncm91bmQpIHtcbiAgICAgICAgb2JqZWN0LmRlYnVnZ2VyUmVuZGVyQmFja2dyb3VuZChcbiAgICAgICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQub2JqZWN0c1tvYmplY3QucmVuZGVyTGF5ZXJdXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmplY3QucmVuZGVyICYmIG9iamVjdC5pc1JlbmRlcmFibGUpIHtcbiAgICAgICAgb2JqZWN0LnJlbmRlcihcbiAgICAgICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQub2JqZWN0c1tvYmplY3QucmVuZGVyTGF5ZXJdXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy5vYmplY3QucmVuZGVyQm91bmRhcnkpIHtcbiAgICAgICAgb2JqZWN0LmRlYnVnZ2VyUmVuZGVyQm91bmRhcnkoXG4gICAgICAgICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0Lm9iamVjdHNbb2JqZWN0LnJlbmRlckxheWVyXVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLnRpbWluZy5mcmFtZVJlbmRlcikge1xuICAgICAgY29uc29sZS50aW1lRW5kKCdbZnJhbWVdIHJlbmRlcicpO1xuICAgIH1cbiAgfVxuXG4gIGRlZmF1bHRSZW5kZXJlcigpOiB2b2lkIHtcbiAgICAvLyBzZXQgY2FtZXJhIHBvc2l0aW9uc1xuICAgIHRoaXMuZ2xvYmFscy5jYW1lcmEuc3RhcnRYID0gMDtcbiAgICB0aGlzLmdsb2JhbHMuY2FtZXJhLnN0YXJ0WSA9IDA7XG4gICAgdGhpcy5nbG9iYWxzLmNhbWVyYS5lbmRYID0gMDtcbiAgICB0aGlzLmdsb2JhbHMuY2FtZXJhLmVuZFkgPSAwO1xuXG4gICAgLy8gcmVuZGVyXG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0LmJhY2tncm91bmQuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xuICAgICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZShjb250ZXh0LmNhbnZhcywgMCwgMCk7XG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0Lm9iamVjdHMuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xuICAgICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZShjb250ZXh0LmNhbnZhcywgMCwgMCk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRPYmplY3Qoc2NlbmVPYmplY3Q6IFNjZW5lT2JqZWN0KTogdm9pZCB7XG4gICAgdGhpcy5vYmplY3RzLnB1c2goc2NlbmVPYmplY3QpO1xuICB9XG5cbiAgLy8gVE9ETyhzbWcpOiBJIGFtIHJldGhpbmtpbmcgdGhlIGNvbmNlcHQgb2YgcmVtb3ZpbmcgdGhlIG9iamVjdCBmcm9tIHRoZSBzY2VuZSBkdXJpbmcgYW5vdGhlciBvYmplY3QncyB1cGRhdGUuXG4gIC8vIEkgdGhpbmsgaXQgd291bGQgYmUgYmV0dGVyIHRvIGhhdmUgYSBmbGFnIHRoYXQgaXMgY2hlY2tlZCBkdXJpbmcgdGhlIHNjZW5lJ3MgdXBkYXRlIGxvb3AgdG8gcm1vdmUgdGhlIG9iZWpjdCBiZWZvcmUgaXQncyBuZXh0IHVwZGF0ZVxuICAvLyBwZXJoYXBzIHVzaW5nIGZsYWdnZWRGb3JEZXN0cm95XG4gIHJlbW92ZU9iamVjdChzY2VuZU9iamVjdDogU2NlbmVPYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoc2NlbmVPYmplY3QuZGVzdHJveSkge1xuICAgICAgc2NlbmVPYmplY3QuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLm9iamVjdHMuc3BsaWNlKHRoaXMub2JqZWN0cy5pbmRleE9mKHNjZW5lT2JqZWN0KSwgMSk7XG4gIH1cblxuICAvLyBUT0RPKHNtZyk6IHRoaXMgcHJldmVudHMgd2VpcmQgaXNzdWVzIGNhdXNlZCBieSBjYWxsaW5nIHJlbW92ZU9iamVjdCBtdWx0aXBsZSB0aW1lcyBkaXJlY3RseSBmb3IgdGhlIHNhbWUgb2JqZWN0IGJ1dCBpdCBpcyBpbmVmZmljaWVudFxuICAvLyByZXZpZXcgdGhpcyBhdCBhIGxhdGVyIHN0YWdlXG4gIHJlbW92ZU9iamVjdEJ5SWQoc2NlbmVPYmplY3RJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IG9iamVjdCA9IHRoaXMub2JqZWN0cy5maW5kKG8gPT4gby5pZCA9PT0gc2NlbmVPYmplY3RJZCk7XG4gICAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlT2JqZWN0KG9iamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgaW5zdGFuY2VzIG9mIHRoZSBwcm92aWRlZCBjbGFzc1xuICAgKiBAcGFyYW0gdHlwZVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZ2V0T2JqZWN0c0J5VHlwZSh0eXBlOiBhbnkpOiBTY2VuZU9iamVjdFtdIHtcbiAgICAvLyBUT0RPKHNtZyk6IGhvcnJpYmx5IHVuZGVycGVyZm9ybWFudCwgcGVyaGFwcyB1c2UgYSBoYXNoIG9uIG9iamVjdCB0eXBlIGluc3RlYWQ/XG4gICAgcmV0dXJuIHRoaXMub2JqZWN0cy5maWx0ZXIobyA9PiBvIGluc3RhbmNlb2YgdHlwZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGFuIG9iamVjdCBleGlzdHMgYXQgdGhlIHByb3ZpZGVkIHBvc2l0aW9uIGFuZCBoYXMgY29sbGlzaW9uXG4gICAqIEBwYXJhbSB4XG4gICAqIEBwYXJhbSB5XG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBoYXNDb2xsaXNpb25BdFBvc2l0aW9uKHBvc2l0aW9uWDogbnVtYmVyLCBwb3NpdGlvblk6IG51bWJlciwgc2NlbmVPYmplY3Q/OiBTY2VuZU9iamVjdCk6IGJvb2xlYW4ge1xuICAgIGxldCBvYmplY3QgPSB0aGlzLm9iamVjdHMuZmluZChvID0+IG8ucG9zaXRpb25YID09PSBwb3NpdGlvblggJiYgby5wb3NpdGlvblkgPT09IHBvc2l0aW9uWSAmJiBvLmhhc0NvbGxpc2lvbik7XG4gICAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaWdub3JlIHByb3ZpZGVkIG9iamVjdCAodXN1YWxseSBzZWxmKVxuICAgIGlmIChzY2VuZU9iamVjdCA9PT0gb2JqZWN0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGFuIG9iamVjdCBpcyBvbiBpdCdzIHdheSB0byB0aGUgcHJvdmlkZWQgcG9zaXRpb24gYW5kIGhhcyBjb2xsaXNpb25cbiAgICogQHBhcmFtIHhcbiAgICogQHBhcmFtIHlcbiAgICogQHJldHVybnNcbiAgICovXG4gIHdpbGxIYXZlQ29sbGlzaW9uQXRQb3NpdGlvbihwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHNjZW5lT2JqZWN0PzogU2NlbmVPYmplY3QpOiBib29sZWFuIHtcbiAgICBsZXQgb2JqZWN0ID0gdGhpcy5vYmplY3RzLmZpbmQobyA9PiBvLnRhcmdldFggPT09IHBvc2l0aW9uWCAmJiBvLnRhcmdldFkgPT09IHBvc2l0aW9uWSAmJiBvLmhhc0NvbGxpc2lvbik7XG4gICAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaWdub3JlIHByb3ZpZGVkIG9iamVjdCAodXN1YWxseSBzZWxmKVxuICAgIGlmIChzY2VuZU9iamVjdCA9PT0gb2JqZWN0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc091dE9mQm91bmRzKHBvc2l0aW9uWDogbnVtYmVyLCBwb3NpdGlvblk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAocG9zaXRpb25YID4gdGhpcy5tYXAud2lkdGggLSAxIHx8IHBvc2l0aW9uWSA+IHRoaXMubWFwLmhlaWdodCAtIDEgfHwgcG9zaXRpb25YIDwgMCB8fCBwb3NpdGlvblkgPCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbWJpbmF0aW9uIG9mIGhhc0NvbGxpc2lvbkF0UG9zaXRpb24gYW5kIHdpbGxIYXZlQ29sbGlzaW9uQXRQb3NpdGlvblxuICAgKiBAcGFyYW0gcG9zaXRpb25YXG4gICAqIEBwYXJhbSBwb3NpdGlvbllcbiAgICogQHBhcmFtIHNjZW5lT2JqZWN0XG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBoYXNPcldpbGxIYXZlQ29sbGlzaW9uQXRQb3NpdGlvbihwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHNjZW5lT2JqZWN0PzogU2NlbmVPYmplY3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5oYXNDb2xsaXNpb25BdFBvc2l0aW9uKHBvc2l0aW9uWCwgcG9zaXRpb25ZLCBzY2VuZU9iamVjdCkgfHwgdGhpcy53aWxsSGF2ZUNvbGxpc2lvbkF0UG9zaXRpb24ocG9zaXRpb25YLCBwb3NpdGlvblksIHNjZW5lT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIHRoZSBmaXJzdCBvYmplY3QgZm91bmQgYXQgdGhlIHByb3ZpZGVkIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBwb3NpdGlvblhcbiAgICogQHBhcmFtIHBvc2l0aW9uWVxuICAgKiBAcGFyYW0gdHlwZVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZ2V0T2JqZWN0QXRQb3NpdGlvbihwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHR5cGU/OiBhbnkpOiBTY2VuZU9iamVjdCB8IHVuZGVmaW5lZCB7XG4gICAgLy8gVE9ETyhzbWcpOiBhZGQgb3B0aW9uYWwgdHlwZSBjaGVja1xuICAgIC8vIFRPRE8oc21nKTogdGhpcyBpcyBhIHZlcnkgaGVhdnkgb3BlcmF0aW9uXG4gICAgcmV0dXJuIHRoaXMub2JqZWN0cy5maW5kKG8gPT4gby5wb3NpdGlvblggPT09IHBvc2l0aW9uWCAmJiBvLnBvc2l0aW9uWSA9PT0gcG9zaXRpb25ZICYmIG8uY29sbGlzaW9uTGF5ZXIgIT09IENhbnZhc0NvbnN0YW50cy5VSV9DT0xMSVNJT05fTEFZRVIpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYWxsIG9iamVjdHMgZm91bmQgYXQgdGhlIHByb3ZpZGVkIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBwb3NpdGlvblhcbiAgICogQHBhcmFtIHBvc2l0aW9uWVxuICAgKiBAcGFyYW0gdHlwZVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZ2V0QWxsT2JqZWN0c0F0UG9zaXRpb24ocG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCB0eXBlPzogYW55KTogU2NlbmVPYmplY3RbXSB7XG4gICAgLy8gVE9ETyhzbWcpOiBhZGQgb3B0aW9uYWwgdHlwZSBjaGVja1xuICAgIC8vIFRPRE8oc21nKTogdGhpcyBpcyBhIHZlcnkgaGVhdnkgb3BlcmF0aW9uXG4gICAgcmV0dXJuIHRoaXMub2JqZWN0cy5maWx0ZXIobyA9PiBvLnBvc2l0aW9uWCA9PT0gcG9zaXRpb25YICYmIG8ucG9zaXRpb25ZID09PSBwb3NpdGlvblkgJiYgby5jb2xsaXNpb25MYXllciAhPT0gQ2FudmFzQ29uc3RhbnRzLlVJX0NPTExJU0lPTl9MQVlFUik7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUFsbE9iamVjdHMoKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMub2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnJlbW92ZU9iamVjdCh0aGlzLm9iamVjdHNbMF0pO1xuICAgIH1cbiAgICAvLyB0aGlzLm9iamVjdHMgPSBbXTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQWxsQmFja2dyb3VuZExheWVycygpOiB2b2lkIHtcbiAgICB0aGlzLmJhY2tncm91bmRMYXllcnMgPSBbXTtcbiAgfVxuXG4gIHNldFVwUmVuZGVyaW5nQ29udGV4dHMoKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0ge1xuICAgICAgYmFja2dyb3VuZDogW10sXG4gICAgICBvYmplY3RzOiBbXSxcbiAgICB9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhY2tncm91bmRMYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygpO1xuICAgICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0LmJhY2tncm91bmRbaV0gPSBSZW5kZXJVdGlscy5nZXRDb250ZXh0KGNhbnZhcyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQ2FudmFzQ29uc3RhbnRzLk9CSkVDVF9SRU5ERVJJTkdfTEFZRVJTOyBpKyspIHtcbiAgICAgIGxldCBjYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygpO1xuICAgICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0Lm9iamVjdHNbaV0gPSBSZW5kZXJVdGlscy5nZXRDb250ZXh0KGNhbnZhcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIGxldCBjYW52YXMgPSBSZW5kZXJVdGlscy5jcmVhdGVDYW52YXModGhpcy5tYXAud2lkdGgsIHRoaXMubWFwLmhlaWdodCk7XG5cbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcudWkuY2FudmFzTGF5ZXJzKSB7XG4gICAgICB0aGlzLmNsaWVudC5jb250YWluZXIuYXBwZW5kKGNhbnZhcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIGZsYWdGb3JNYXBDaGFuZ2UoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuZmxhZ2dlZEZvck1hcENoYW5nZSA9IGluZGV4O1xuICB9XG5cbiAgLy8gVE9ETyhzbWcpOiBhbGxvdyB0aGlzIHRvIGhhdmUgYSB0aW1lciBzZXQgZm9yIGl0XG4gIGNoYW5nZU1hcChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gY2xlYW4gdXAgbWFwXG4gICAgaWYgKHRoaXMubWFwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMubWFwLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBjbGVhbiB1cCBzY2VuZVxuICAgIC8vIFRPRE8oc21nKTogc29tZSBzb3J0IG9mIHNjZW5lIHJlc2V0IGZ1bmN0aW9uXG4gICAgdGhpcy5yZW1vdmVBbGxPYmplY3RzKCk7XG4gICAgdGhpcy5yZW1vdmVBbGxCYWNrZ3JvdW5kTGF5ZXJzKCk7XG5cbiAgICAvLyBzZXQgdXAgbmV3IG1hcFxuICAgIGNvbnNvbGUubG9nKCdbU2NlbmVdIGNoYW5naW5nIG1hcCB0bycsIGluZGV4KTtcbiAgICB0aGlzLm1hcCA9IFJlZmxlY3QuY29uc3RydWN0KHRoaXMubWFwc1tpbmRleF0sIFt0aGlzLCB0aGlzLmNvbnRleHQsIHRoaXMuYXNzZXRzXSk7XG4gICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzLnB1c2goLi4udGhpcy5tYXAuYmFja2dyb3VuZExheWVycyk7XG4gICAgdGhpcy5vYmplY3RzLnB1c2goLi4udGhpcy5tYXAub2JqZWN0cyk7XG5cbiAgICAvLyBzZXQgdXAgcmVuZGVyaW5nIGNvbnRleHRzXG4gICAgLy8gY3VzdG9tIHJlbmRlcmVycyBpbiBvYmplY3RzIGZvciBtYXBzIHJlcXVpcmUgdGhpc1xuICAgIHRoaXMuc2V0VXBSZW5kZXJpbmdDb250ZXh0cygpO1xuXG4gICAgLy8gcmVtb3ZlIGZsYWdcbiAgICB0aGlzLmZsYWdnZWRGb3JNYXBDaGFuZ2UgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBjaGFuZ2VTY2VuZShzY2VuZUNsYXNzOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNsaWVudC5jaGFuZ2VTY2VuZShzY2VuZUNsYXNzKTtcbiAgfVxuXG4gIHNldEN1c3RvbVJlbmRlcmVyKHJlbmRlcmVyOiBDdXN0b21SZW5kZXJlclNpZ25hdHVyZSk6IHZvaWQge1xuICAgIHRoaXMuY3VzdG9tUmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgfVxuXG4gIHJlbW92ZUN1c3RvbWVyUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgdGhpcy5jdXN0b21SZW5kZXJlciA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2ZW50TmFtZTogc3RyaW5nLCBkZXRhaWw/OiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGRldGFpbCwgfSk7XG4gICAgY29uc29sZS5sb2coJ1tkaXNwYXRjaEV2ZW50XScsIGV2ZW50KTtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNwcml0ZUFuaW1hdGlvbiB7XG4gIHRpbGVzZXQ6IHN0cmluZztcbiAgZHVyYXRpb246IG51bWJlcjsgLy8gbGVuZ3RoIG9mIGFuaW1hdGlvbiBpbiBzZWNvbmRzXG4gIGZyYW1lczogU3ByaXRlQW5pbWF0aW9uRnJhbWVbXTtcblxuICBjb25zdHJ1Y3Rvcih0aWxlc2V0OiBzdHJpbmcsIGZyYW1lczogU3ByaXRlQW5pbWF0aW9uRnJhbWVbXSkge1xuICAgIHRoaXMudGlsZXNldCA9IHRpbGVzZXQ7XG4gICAgdGhpcy5mcmFtZXMgPSBmcmFtZXM7XG4gICAgdGhpcy5kdXJhdGlvbiA9IGZyYW1lcy5yZWR1Y2UoKGFjYywgZnJhbWUpID0+IGFjYyArIGZyYW1lLmR1cmF0aW9uLCAwKTtcbiAgfVxuXG4gIC8vIHJldHVybnMgdGhlIGN1cnJlbnQgZnJhbWUgb2YgdGhlIGFuaW1hdGlvbiBiYXNlZCBvbiB0aGUgdGltZVxuICBjdXJyZW50RnJhbWUodGltZTogbnVtYmVyKTogU3ByaXRlQW5pbWF0aW9uRnJhbWUge1xuICAgIGxldCBjdXJyZW50VGltZSA9IHRpbWUgJSB0aGlzLmR1cmF0aW9uO1xuICAgIGxldCBjdXJyZW50RHVyYXRpb24gPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGN1cnJlbnREdXJhdGlvbiArPSB0aGlzLmZyYW1lc1tpXS5kdXJhdGlvbjtcbiAgICAgIGlmIChjdXJyZW50VGltZSA8IGN1cnJlbnREdXJhdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5mcmFtZXNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZyYW1lc1swXTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNwcml0ZUFuaW1hdGlvbkZyYW1lIHtcbiAgc3ByaXRlWDogbnVtYmVyO1xuICBzcHJpdGVZOiBudW1iZXI7XG4gIGR1cmF0aW9uOiBudW1iZXI7IC8vIGxlbmd0aCBvZiBhbmltYXRpb24gaW4gc2Vjb25kc1xufVxuIiwiaW1wb3J0IHsgdHlwZSBTY2VuZSB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5cbmNvbnN0IERFRkFVTFRfRFVSQVRJT04gPSAxO1xuY29uc3QgREVGQVVMVF9PTl9JTlRFUlZBTCA9ICgpOiB2b2lkID0+IHt9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEludGVydmFsT2JqZWN0Q29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcbiAgZHVyYXRpb24/OiBudW1iZXI7IC8vIGR1cmF0aW9uIG9mIGVhY2ggaW50ZXJ2YWwgaW4gc2Vjb25kcyAoZS5nLiAxID0gMSBzZWNvbmQpXG4gIG9uSW50ZXJ2YWw/OiAoKSA9PiB2b2lkOyAvLyBmdW5jdGlvbiB0byBjYWxsIG9uIGVhY2ggaW50ZXJ2YWxcbiAgb25EZXN0cm95PzogKCkgPT4gdm9pZDsgLy8gZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBvYmplY3QgaXMgZGVzdHJveWVkXG4gIG1heEludGVydmFscz86IG51bWJlcjsgLy8gbWF4aW11bSBudW1iZXIgb2YgaW50ZXJ2YWxzIHRvIHJ1biBiZWZvcmUgZGVzdHJveWluZyB0aGUgb2JqZWN0XG59XG5cbi8qKlxuICogQW4gb2JqZWN0IHRoYXQgcnVucyBhIGZ1bmN0aW9uIGF0IHJlZ3VsYXIgaW50ZXJ2YWxzXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnRlcnZhbE9iamVjdCBleHRlbmRzIFNjZW5lT2JqZWN0IHtcbiAgcHJpdmF0ZSB0aW1lciA9IDA7XG4gIHByaXZhdGUgaW50ZXJ2YWxzQ29tcGxldGUgPSAwO1xuICBwcml2YXRlIHJlYWRvbmx5IG1heEludGVydmFsczogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIHJlYWRvbmx5IGR1cmF0aW9uOiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgb25JbnRlcnZhbDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSByZWFkb25seSBvbkRlc3Ryb3k/OiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBzY2VuZTogU2NlbmUsXG4gICAgY29uZmlnOiBJbnRlcnZhbE9iamVjdENvbmZpZ1xuICApIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMuZHVyYXRpb24gPSBjb25maWcuZHVyYXRpb24gPz8gREVGQVVMVF9EVVJBVElPTjtcbiAgICB0aGlzLm9uSW50ZXJ2YWwgPSBjb25maWcub25JbnRlcnZhbCA/PyBERUZBVUxUX09OX0lOVEVSVkFMO1xuICAgIHRoaXMub25EZXN0cm95ID0gY29uZmlnLm9uRGVzdHJveSA/PyB1bmRlZmluZWQ7XG4gICAgdGhpcy5tYXhJbnRlcnZhbHMgPSBjb25maWcubWF4SW50ZXJ2YWxzO1xuICB9XG5cbiAgdXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnRpbWVyICs9IGRlbHRhO1xuXG4gICAgaWYgKHRoaXMudGltZXIgPj0gdGhpcy5kdXJhdGlvbikge1xuICAgICAgdGhpcy5vbkludGVydmFsKCk7XG4gICAgICB0aGlzLnRpbWVyIC09IHRoaXMuZHVyYXRpb247IC8vIHJlbW92ZSB0aGUgZHVyYXRpb24gZnJvbSB0aGUgdGltZXIgcmF0aGVyIHRoYW4gc2V0IHRvIDAgdG8gYXZvaWQgZHJpZnRcblxuICAgICAgdGhpcy5pbnRlcnZhbHNDb21wbGV0ZSsrO1xuXG4gICAgICBpZiAodGhpcy5tYXhJbnRlcnZhbHMgJiYgdGhpcy5pbnRlcnZhbHNDb21wbGV0ZSA+PSB0aGlzLm1heEludGVydmFscykge1xuICAgICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9uRGVzdHJveSkge1xuICAgICAgdGhpcy5vbkRlc3Ryb3koKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ1tJbnRlcnZhbE9iamVjdF0gZGVzdHJveWVkJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IHR5cGUgU2NlbmUgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZSc7XG5pbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcbiAgcG9zaXRpb25YOiBudW1iZXI7XG4gIHBvc2l0aW9uWTogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgdGlsZXNldDogc3RyaW5nO1xuICBzcHJpdGVZOiBudW1iZXI7XG4gIHNwcml0ZVg6IG51bWJlcjtcbiAgcmVuZGVyTGF5ZXI/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTcHJpdGVPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG4gIGhhc0NvbGxpc2lvbiA9IGZhbHNlO1xuXG4gIHRpbGVzZXQ6IHN0cmluZztcbiAgc3ByaXRlWDogbnVtYmVyO1xuICBzcHJpdGVZOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBTY2VuZSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMud2lkdGggPSBjb25maWcud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuICAgIHRoaXMudGlsZXNldCA9IGNvbmZpZy50aWxlc2V0O1xuICAgIHRoaXMuc3ByaXRlWCA9IGNvbmZpZy5zcHJpdGVYO1xuICAgIHRoaXMuc3ByaXRlWSA9IGNvbmZpZy5zcHJpdGVZO1xuICAgIHRoaXMucmVuZGVyTGF5ZXIgPSBjb25maWcucmVuZGVyTGF5ZXIgPz8gMDtcbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICBjb250ZXh0LFxuICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzWydzcHJpdGVzJ10sXG4gICAgICB0aGlzLnNwcml0ZVgsXG4gICAgICB0aGlzLnNwcml0ZVksXG4gICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgIHRoaXMucG9zaXRpb25ZLFxuICAgICAgdGhpcy53aWR0aCxcbiAgICAgIHRoaXMuaGVpZ2h0XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdGhVdGlscyB7XG4gIC8vIGluY2x1ZGluZyBtaW4gYW5kIG1heFxuICBzdGF0aWMgcmFuZG9tSW50RnJvbVJhbmdlKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5yYW5kb21OdW1iZXJGcm9tUmFuZ2UobWluLCBtYXgpKTtcbiAgfVxuXG4gIHN0YXRpYyByYW5kb21OdW1iZXJGcm9tUmFuZ2UobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbjtcbiAgfVxuXG4gIC8vIGZvciBhZGRpbmcgYSBiaXQgb2YgcmFuZG9tbmVzcyB0byBhbmltYXRpb24gc3RhcnQgdGltZXNcbiAgc3RhdGljIHJhbmRvbVN0YXJ0aW5nRGVsdGEoc2Vjb25kcz86IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAoc2Vjb25kcyA/PyAxKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1vdXNlUG9zaXRpb24ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgZXhhY3RYOiBudW1iZXI7XG4gIGV4YWN0WTogbnVtYmVyO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW91c2VVdGlscyB7XG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IG1vdXNlIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMsIHRha2luZyBpbnRvIGFjY291bnQgZnVsbHNjcmVlbiBtb2RlXG4gICAqIEZ1bGxzY3JlZW4gbW9kZSBhZGp1c3RzIHRoZSBoZWlnaHQgaWYgbGFuZHNjYXBlLCBvciB3aWR0aCBpZiBwb3J0cmFpdCwgb2YgdGhlIGNhbnZhcyBlbGVtZW50LCBidXQgbm90IHRoZSBwaXhlbCBzaXplIG9mIHRoZSBjYW52YXMsIHNvIHdlIG5lZWQgdG8gYWRqdXN0IHRoZSBtb3VzZSBwb3NpdGlvbiBhY2NvcmRpbmdseVxuICAgKiBAcGFyYW0gY2FudmFzXG4gICAqIEBwYXJhbSBldnRcbiAgICogQHJldHVybnNcbiAgICovXG4gIHN0YXRpYyBnZXRNb3VzZVBvc2l0aW9uKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGV2ZW50OiBNb3VzZUV2ZW50KTogTW91c2VQb3NpdGlvbiB7XG4gICAgbGV0IGJvdW5kaW5nUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGxldCBhZGp1c3RlZEJvdW50aW5nUmVjdCA9IHtcbiAgICAgIGhlaWdodDogYm91bmRpbmdSZWN0LmhlaWdodCxcbiAgICAgIHdpZHRoOiBib3VuZGluZ1JlY3Qud2lkdGgsXG4gICAgfTtcblxuICAgIGxldCBhZGp1c3RlZEV2ZW50ID0ge1xuICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgfTtcblxuICAgIC8vIHdoZW4gY2FudmFzIGlzIGluIGZ1bGxzY3JlZW4gbW9kZSwgdGhlIGNhbnZhcyB3aWxsIGJlIGNlbnRlcmVkIGluIHRoZSB3aW5kb3csIG1lc3NpbmcgdXAgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBheGlzIHRoYXQgaXNuJ3QgZnVsbCB3aWR0aCBvciBoZWlnaHRcbiAgICBsZXQgcmF0aW87IC8vIHJhdGlvIG9mIGNhbnZhcyBlbGVtZW50IHNpemUgdG8gY2FudmFzIHBpeGVsIHNpemVcbiAgICBpZiAoY2FudmFzLndpZHRoID4gY2FudmFzLmhlaWdodCkge1xuICAgICAgcmF0aW8gPSBjYW52YXMud2lkdGggLyBib3VuZGluZ1JlY3Qud2lkdGg7IC8vIHJhdGlvIG9mIGNhbnZhcyBlbGVtZW50IHNpemUgdG8gY2FudmFzIHBpeGVsIHNpemVcblxuICAgICAgLy8gYWRqdXN0IGJvdW5kaW5nIHJlY3RcbiAgICAgIGFkanVzdGVkQm91bnRpbmdSZWN0LmhlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyByYXRpbztcblxuICAgICAgLy8gYWRqdXN0IGNsaWNrIHBvc2l0aW9uXG4gICAgICBsZXQgYWRkaXRpb25hbEhlaWdodCA9IChib3VuZGluZ1JlY3QuaGVpZ2h0IC0gYWRqdXN0ZWRCb3VudGluZ1JlY3QuaGVpZ2h0KTtcbiAgICAgIGFkanVzdGVkRXZlbnQuY2xpZW50WSAtPSAoYWRkaXRpb25hbEhlaWdodCAvIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYXRpbyA9IGNhbnZhcy5oZWlnaHQgLyBib3VuZGluZ1JlY3QuaGVpZ2h0OyAvLyByYXRpbyBvZiBjYW52YXMgZWxlbWVudCBzaXplIHRvIGNhbnZhcyBwaXhlbCBzaXplXG5cbiAgICAgIC8vIGFkanVzdCBib3VuZGluZyByZWN0XG4gICAgICBhZGp1c3RlZEJvdW50aW5nUmVjdC53aWR0aCA9IGNhbnZhcy53aWR0aCAvIHJhdGlvO1xuXG4gICAgICAvLyBhZGp1c3QgY2xpY2sgcG9zaXRpb25cbiAgICAgIGxldCBhZGRpdGlvbmFsV2lkdGggPSAoYm91bmRpbmdSZWN0LndpZHRoIC0gYWRqdXN0ZWRCb3VudGluZ1JlY3Qud2lkdGgpO1xuICAgICAgYWRqdXN0ZWRFdmVudC5jbGllbnRYIC09IChhZGRpdGlvbmFsV2lkdGggLyAyKTtcbiAgICB9XG5cbiAgICBsZXQgc2NhbGVYID0gY2FudmFzLndpZHRoIC8gYWRqdXN0ZWRCb3VudGluZ1JlY3Qud2lkdGg7XG4gICAgbGV0IHNjYWxlWSA9IGNhbnZhcy5oZWlnaHQgLyBhZGp1c3RlZEJvdW50aW5nUmVjdC5oZWlnaHQ7XG5cbiAgICAvLyBzY2FsZSBtb3VzZSBjb29yZGluYXRlcyBhZnRlciB0aGV5IGhhdmUgYmVlbiBhZGp1c3RlZCB0byBiZSByZWxhdGl2ZSB0byBlbGVtZW50XG4gICAgbGV0IHggPSAoKGFkanVzdGVkRXZlbnQuY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0KSAqIHNjYWxlWCkgLyBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFO1xuICAgIGxldCB5ID0gKChhZGp1c3RlZEV2ZW50LmNsaWVudFkgLSBib3VuZGluZ1JlY3QudG9wKSAqIHNjYWxlWSkgLyBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLmZsb29yKHgpLFxuICAgICAgeTogTWF0aC5mbG9vcih5KSxcbiAgICAgIGV4YWN0WDogeCxcbiAgICAgIGV4YWN0WTogeSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIHNldEN1cnNvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBjdXJzb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIGNhbnZhcy5zdHlsZS5jdXJzb3IgPSBgdXJsKFwiJHtjdXJzb3J9XCIpLCBhdXRvYDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldCBpc0Z1bGxzY3JlZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ICE9PSBudWxsO1xuICB9XG5cbiAgc3RhdGljIGlzQ2xpY2tXaXRoaW4obW91c2VQb3NpdGlvbjogTW91c2VQb3NpdGlvbiwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1vdXNlUG9zaXRpb24uZXhhY3RYID49IHggJiZcbiAgICAgIG1vdXNlUG9zaXRpb24uZXhhY3RYIDw9IHggKyB3aWR0aCAmJlxuICAgICAgbW91c2VQb3NpdGlvbi5leGFjdFkgPj0geSAmJlxuICAgICAgbW91c2VQb3NpdGlvbi5leGFjdFkgPD0geSArIGhlaWdodFxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJy4uL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlbmRlclV0aWxzIHtcbiAgc3RhdGljIHJlbmRlclNwcml0ZShcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgc3ByaXRlU2hlZXQ6IEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgc3ByaXRlWDogbnVtYmVyLFxuICAgIHNwcml0ZVk6IG51bWJlcixcbiAgICBwb3NpdGlvblg6IG51bWJlcixcbiAgICBwb3NpdGlvblk6IG51bWJlcixcbiAgICBzcHJpdGVXaWR0aD86IG51bWJlcixcbiAgICBzcHJpdGVIZWlnaHQ/OiBudW1iZXIsXG4gICAgb3B0aW9uczogeyBzY2FsZT86IG51bWJlcjsgb3BhY2l0eT86IG51bWJlcjsgdHlwZT86ICd0aWxlJyB8ICdwaXhlbCc7IHJvdGF0aW9uPzogbnVtYmVyOyB9ID0geyB9IC8vIFRPRE8oc21nKTogaW1wbGVtZW50IHRpbGUgdnMgcGl4ZWxcbiAgKTogdm9pZCB7XG4gICAgbGV0IHdpZHRoID0gc3ByaXRlV2lkdGggPyBzcHJpdGVXaWR0aCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgOiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFO1xuICAgIGxldCBoZWlnaHQgPSBzcHJpdGVIZWlnaHQgPyBzcHJpdGVIZWlnaHQgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFIDogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgICBsZXQgc2NhbGUgPSBvcHRpb25zLnNjYWxlID8/IDE7IC8vIHVzZSB0byBzY2FsZSB0aGUgb3V0cHV0XG4gICAgbGV0IHJvdGF0aW9uID0gb3B0aW9ucy5yb3RhdGlvbiA/PyAwOyAvLyBkZWdyZWVzIHRvIHJvdGF0ZSB0aGUgc3ByaXRlIGJ5XG5cbiAgICAvLyBzYXZlIHRoZSBjdXJyZW50IGNvbnRleHQgaWYgd2UgbmVlZCB0byBhcHBseSBvcGFjaXR5LCB0aGVuIHJlc3RvcmUgaXQgYWZ0ZXJcbiAgICAvLyB3ZSBkb24ndCBkbyB0aGlzIGZvciBhbGwgcmVuZGVycyBhcyBpdCBpcyBhIHBlcmZvcm1hbmNlIGhpdFxuICAgIGxldCB1cGRhdGVPcGFjaXR5ID0gKG9wdGlvbnMub3BhY2l0eSAmJiBvcHRpb25zLm9wYWNpdHkgPCAxKTtcbiAgICBsZXQgdXBkYXRlUm90YXRpb24gPSAocm90YXRpb24gIT09IDApO1xuXG4gICAgbGV0IHNob3VsZFNhdmUgPSAodXBkYXRlT3BhY2l0eSB8fCB1cGRhdGVSb3RhdGlvbik7XG4gICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgIGNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICBpZiAodXBkYXRlT3BhY2l0eSkge1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gTWF0aC5tYXgoMCwgb3B0aW9ucy5vcGFjaXR5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVwZGF0ZVJvdGF0aW9uKSB7XG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byB0aGUgY2VudGVyIG9mIHRoZSBzcHJpdGUsIHJvdGF0ZSwgdGhlbiB0cmFuc2xhdGUgYmFja1xuICAgICAgICBsZXQgeFRyYW5zbGF0aW9uID0gTWF0aC5mbG9vcigocG9zaXRpb25YICsgKHNwcml0ZVdpZHRoIC8gMikpICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyAwLjU7XG4gICAgICAgIGxldCB5VHJhbnNsYXRpb24gPSBNYXRoLmZsb29yKChwb3NpdGlvblkgKyAoc3ByaXRlSGVpZ2h0IC8gMikpICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyAwLjU7XG5cbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeFRyYW5zbGF0aW9uLCB5VHJhbnNsYXRpb24pO1xuICAgICAgICAvLyBUT0RPKHNtZyk6IGFueSBhbmdsZSB0aGF0IGlzbid0IDkwLCAxODAsIDI3MCwgZXRjIHdpbGwgY2F1c2UgYmx1cnJpbmcgLyB3ZWlyZCBzcHJpdGUgaW50ZXJvcGxhdGlvbi4gVGhpcyBpcyBhIGtub3duIGlzc3VlIHdpdGggY2FudmFzIGFuZCB3aWxsIG5lZWQgdG8gc2VlIGlmIHRoaXMgY2FuIGJlIHdvcmtlZCBhcm91bmRcbiAgICAgICAgY29udGV4dC5yb3RhdGUoKHJvdGF0aW9uICogTWF0aC5QSSkgLyAxODApO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgteFRyYW5zbGF0aW9uLCAteVRyYW5zbGF0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgIHNwcml0ZVNoZWV0LFxuICAgICAgc3ByaXRlWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUsIC8vIHRyYW5zbGF0ZSBzcHJpdGUgcG9zaXRpb24gdG8gcGl4ZWwgcG9zaXRpb25cbiAgICAgIHNwcml0ZVkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFLCAvLyB0cmFuc2xhdGUgc3ByaXRlIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIE1hdGguZmxvb3IocG9zaXRpb25YICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksIC8vIHRyYW5zbGF0ZSBncmlkIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uLCByb3VuZGVkIHRvIG5lYXJlc3QgcGl4ZWwgdG8gcHJldmVudCBibHVycmluZ1xuICAgICAgTWF0aC5mbG9vcihwb3NpdGlvblkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSwgLy8gdHJhbnNsYXRlIGdyaWQgcG9zaXRpb24gdG8gcGl4ZWwgcG9zaXRpb24sIHJvdW5kZWQgdG8gbmVhcmVzdCBwaXhlbCB0byBwcmV2ZW50IGJsdXJyaW5nXG4gICAgICB3aWR0aCAqIHNjYWxlLFxuICAgICAgaGVpZ2h0ICogc2NhbGVcbiAgICApO1xuXG4gICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJTdWJzZWN0aW9uKFxuICAgIHNvdXJjZTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIGRlc3RpbmF0aW9uOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgc3RhcnRYOiBudW1iZXIsXG4gICAgc3RhcnRZOiBudW1iZXIsXG4gICAgZW5kWDogbnVtYmVyLFxuICAgIGVuZFk6IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBsZXQgc3RhcnRYUGl4ZWwgPSBNYXRoLmZsb29yKHN0YXJ0WCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpO1xuICAgIGxldCBzdGFydFlQaXhlbCA9IE1hdGguZmxvb3Ioc3RhcnRZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSk7XG4gICAgbGV0IGVuZFhQaXhlbCA9IE1hdGguZmxvb3IoZW5kWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpO1xuICAgIGxldCBlbmRZUGl4ZWwgPSBNYXRoLmZsb29yKGVuZFkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKTtcblxuICAgIGRlc3RpbmF0aW9uLmRyYXdJbWFnZShcbiAgICAgIHNvdXJjZS5jYW52YXMsXG4gICAgICBzdGFydFhQaXhlbCxcbiAgICAgIHN0YXJ0WVBpeGVsLFxuICAgICAgZW5kWFBpeGVsIC0gc3RhcnRYUGl4ZWwsXG4gICAgICBlbmRZUGl4ZWwgLSBzdGFydFlQaXhlbCxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgZGVzdGluYXRpb24uY2FudmFzLndpZHRoLFxuICAgICAgZGVzdGluYXRpb24uY2FudmFzLmhlaWdodFxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgcmVuZGVyQ2lyY2xlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCBvcHRpb25zOiB7IGNvbG91cj86IHN0cmluZzsgfSA9IHt9KTogdm9pZCB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyhcbiAgICAgIChwb3NpdGlvblggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSArIChDYW52YXNDb25zdGFudHMuVElMRV9TSVpFIC8gMiksXG4gICAgICAocG9zaXRpb25ZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyAoQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAvIDIpLFxuICAgICAgQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAvIDIsXG4gICAgICAwLFxuICAgICAgMiAqIE1hdGguUElcbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBvcHRpb25zLmNvbG91ciB8fCAnc2FkZGxlYnJvd24nO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9XG5cbiAgLy8gVE9ETyhzbWcpOiB0aGlzIGlzIHVzaW5nIGEgbWl4dHVyZSBvZiBwaXhlbCBhbmQgdGlsZSBjb29yZGluYXRlcywgbmVlZCB0byBzdGFuZGFyZGl6ZVxuICBzdGF0aWMgZmlsbFJlY3RhbmdsZShcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcG9zaXRpb25YOiBudW1iZXIsXG4gICAgcG9zaXRpb25ZOiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICBvcHRpb25zOiB7IGNvbG91cj86IHN0cmluZzsgdHlwZT86ICdwaXhlbCcgfCAndGlsZSc7IH0gPSB7IH1cbiAgKTogdm9pZCB7XG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IG9wdGlvbnMuY29sb3VyID8gb3B0aW9ucy5jb2xvdXIgOiAnYmxhY2snO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9ucy5jb2xvdXIgPyBvcHRpb25zLmNvbG91ciA6ICdibGFjayc7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LnJlY3QoXG4gICAgICBNYXRoLmZsb29yKHBvc2l0aW9uWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLCAvLyArMC41IHRvIHByZXZlbnQgYmx1cnJpbmcgYnV0IHRoYXQgY2F1c2VzIGFkZGl0aW9uYWwgaXNzdWVzXG4gICAgICBNYXRoLmZsb29yKHBvc2l0aW9uWSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLCAvLyArMC41IHRvIHByZXZlbnQgYmx1cnJpbmcgYnV0IHRoYXQgY2F1c2VzIGFkZGl0aW9uYWwgaXNzdWVzXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodFxuICAgICk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuXG4gIHN0YXRpYyBzdHJva2VSZWN0YW5nbGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjb2xvdXI/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgLy8gY2FudmFzIHJlbmRlcnMgb24gYSBoYWxmIHBpeGVsIHNvIHdlIG5lZWQgdG8gb2Zmc2V0IGJ5IC41IGluIG9yZGVyIHRvIGdldCB0aGUgc3Ryb2tlIHdpZHRoIHRvIGJlIDFweCwgb3RoZXJ3aXNlIGl0IHdhcyAycHggd2lkZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM4Nzk0MDJcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgY29udGV4dC5zdHJva2VSZWN0KHBvc2l0aW9uWCArIDAuNSwgcG9zaXRpb25ZICsgMC41LCB3aWR0aCAtIDEsIGhlaWdodCAtIDEpO1xuICB9XG5cbiAgc3RhdGljIGNsZWFyQ2FudmFzKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNvbnRleHQuY2FudmFzLndpZHRoLCBjb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUNhbnZhcyh3aWR0aD86IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIC8vIGNyZWF0ZSBjYW52YXNcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBjYW52YXNcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aCA/IHdpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSA6IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfV0lEVEg7XG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodCA/IGhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgOiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX0hFSUdIVDtcblxuICAgIHJldHVybiBjYW52YXM7XG4gIH1cblxuICBzdGF0aWMgZ2V0Q29udGV4dChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHtcbiAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gQ2FudmFzQ29uc3RhbnRzLkNPTlRFWFRfSU1BR0VfU01PT1RISU5HX0VOQUJMRUQ7XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIHN0YXRpYyBwb3NpdGlvblRvUGl4ZWxQb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gcG9zaXRpb24gKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFO1xuICB9XG5cbiAgc3RhdGljIHJlbmRlclRleHQoXG4gICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBwb3NpdGlvblg6IG51bWJlcixcbiAgICBwb3NpdGlvblk6IG51bWJlcixcbiAgICBvcHRpb25zOiB7IHNpemU/OiBudW1iZXI7IGNvbG91cj86IHN0cmluZzsgfSA9IHt9XG4gICk6IHZvaWQge1xuICAgIGxldCBzaXplID0gb3B0aW9ucy5zaXplID8gb3B0aW9ucy5zaXplIDogMTY7XG4gICAgbGV0IGNvbG91ciA9IG9wdGlvbnMuY29sb3VyID8gb3B0aW9ucy5jb2xvdXIgOiAnYmxhY2snO1xuXG4gICAgY29udGV4dC5mb250ID0gYCR7c2l6ZX1weCBIZWx2ZXRpY2FgO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gYCR7Y29sb3VyfWA7XG4gICAgY29udGV4dC5maWxsVGV4dChcbiAgICAgIHRleHQsXG4gICAgICBwb3NpdGlvblggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFLCAvLyB0cmFuc2xhdGUgc3ByaXRlIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uXG4gICAgICBwb3NpdGlvblkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFIC8vIHRyYW5zbGF0ZSBzcHJpdGUgcG9zaXRpb24gdG8gcGl4ZWwgcG9zaXRpb25cbiAgICApO1xuICB9XG5cbiAgc3RhdGljIHRleHRUb0FycmF5KFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICB3aWR0aDogbnVtYmVyLFxuICAgIG9wdGlvbnM6IHsgc2l6ZT86IG51bWJlcjsgY29sb3VyPzogc3RyaW5nOyB9ID0ge31cbiAgKTogc3RyaW5nW10ge1xuICAgIC8vIGRlZmF1bHRzXG4gICAgbGV0IHNpemUgPSBvcHRpb25zLnNpemUgPz8gMTY7XG4gICAgbGV0IGNvbG91ciA9IG9wdGlvbnMuY29sb3VyID8/ICdibGFjayc7XG5cbiAgICAvLyBjb25maWd1cmUgY29udGV4dFxuICAgIGxldCBjb250ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb250ZXh0LmZvbnQgPSBgJHtzaXplfXB4IEhlbHZldGljYWA7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBgJHtjb2xvdXJ9YDtcblxuICAgIC8vIHNwbGl0IHdvcmRzIHRoZW4gY3JlYXRlIG5ldyBsaW5lIG9uY2UgZXhjZWVkaW5nIHdpZHRoXG4gICAgbGV0IHdvcmRzID0gdGV4dC5zcGxpdCgnICcpO1xuICAgIGxldCBjdXJyZW50TGluZSA9ICcnO1xuICAgIGxldCBvdXRwdXQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB1cGRhdGVkTGluZSA9IGAke2N1cnJlbnRMaW5lfSAke3dvcmRzW2ldfWA7XG5cbiAgICAgIC8vIHdpZHRoIGV4Y2VlZGVkLCBlbmQgbGluZVxuICAgICAgaWYgKGNvbnRleHQubWVhc3VyZVRleHQodXBkYXRlZExpbmUpLndpZHRoID49IHdpZHRoKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHVwZGF0ZWRMaW5lKTtcbiAgICAgICAgY3VycmVudExpbmUgPSAnJztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZpbmFsIHdvcmQsIGVuZCBsaW5lXG4gICAgICBpZiAod29yZHMubGVuZ3RoIC0gMSA9PT0gaSkge1xuICAgICAgICBvdXRwdXQucHVzaCh1cGRhdGVkTGluZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBubyBleGl0IGNvbmRpdGlvbiwgc3RvcmUgbmV3IGxpbmVcbiAgICAgIGN1cnJlbnRMaW5lID0gdXBkYXRlZExpbmUudHJpbSgpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY2VuZSwgdHlwZSBTY2VuZUdsb2JhbHNCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgR0FNRV9NQVAgfSBmcm9tICcuL21hcHMvZ2FtZS5tYXAnO1xuaW1wb3J0IHsgdHlwZSBDbGllbnQgfSBmcm9tICdAY29yZS9jbGllbnQnO1xuXG5pbnRlcmZhY2UgR2xvYmFscyBleHRlbmRzIFNjZW5lR2xvYmFsc0Jhc2VDb25maWcge1xuICBzY29yZTogbnVtYmVyO1xuICBoaWdoc2NvcmU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIEdBTUVfU0NFTkUgZXh0ZW5kcyBTY2VuZSB7XG4gIG1hcHMgPSBbXG4gICAgR0FNRV9NQVBcbiAgXTtcblxuICBnbG9iYWxzOiBHbG9iYWxzO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjbGllbnQ6IENsaWVudCkge1xuICAgIHN1cGVyKGNsaWVudCk7XG5cbiAgICB0aGlzLmdsb2JhbHMuc2NvcmUgPSA1MDtcbiAgICB0aGlzLmdsb2JhbHMuaGlnaHNjb3JlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZ2hzY29yZScpID09PSBudWxsID8gMCA6IE51bWJlcihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaGlnaHNjb3JlJykpO1xuXG4gICAgdGhpcy5jaGFuZ2VNYXAoMCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgQmFja2dyb3VuZExheWVyIH0gZnJvbSAnQGNvcmUvbW9kZWwvYmFja2dyb3VuZC1sYXllcic7XG5pbXBvcnQgeyBTY2VuZU1hcCB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW1hcCc7XG5pbXBvcnQgeyB0eXBlIFNjZW5lT2JqZWN0IH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IHR5cGUgR0FNRV9TQ0VORSB9IGZyb20gJy4uL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgU3ByaXRlT2JqZWN0IH0gZnJvbSAnQGNvcmUvb2JqZWN0cy9zcHJpdGUub2JqZWN0JztcbmltcG9ydCB7IFBsYXllck9iamVjdCB9IGZyb20gJy4vZ2FtZS9vYmplY3RzL3BsYXllci5vYmplY3QnO1xuaW1wb3J0IHsgU2NvcmVPYmplY3QgfSBmcm9tICcuL2dhbWUvb2JqZWN0cy9zY29yZS5vYmplY3QnO1xuaW1wb3J0IHsgRmxvb3JPYmplY3QgfSBmcm9tICcuL2dhbWUvb2JqZWN0cy9mbG9vci5vYmplY3QnO1xuaW1wb3J0IHsgQ29udHJvbGxlck9iamVjdCB9IGZyb20gJy4vZ2FtZS9vYmplY3RzL2NvbnRyb2xsZXIub2JqZWN0JztcblxuY29uc3QgTUFQX0hFSUdIVDogbnVtYmVyID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVDtcbmNvbnN0IE1BUF9XSURUSDogbnVtYmVyID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIO1xuXG5leHBvcnQgY2xhc3MgR0FNRV9NQVAgZXh0ZW5kcyBTY2VuZU1hcCB7XG4gIGhlaWdodCA9IE1BUF9IRUlHSFQ7XG4gIHdpZHRoID0gTUFQX1dJRFRIO1xuXG4gIGJhY2tncm91bmRMYXllcnM6IEJhY2tncm91bmRMYXllcltdID0gW1xuXG4gIF07XG5cbiAgb2JqZWN0czogU2NlbmVPYmplY3RbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSkge1xuICAgIHN1cGVyKHNjZW5lKTtcblxuICAgIC8vIFNwcml0ZSBCYWNrZ3JvdW5kIChhcyBvYmplY3QpXG4gICAgdGhpcy5vYmplY3RzLnB1c2gobmV3IFNwcml0ZU9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICBwb3NpdGlvblg6IDAsXG4gICAgICBwb3NpdGlvblk6IDAsXG4gICAgICB3aWR0aDogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRILFxuICAgICAgaGVpZ2h0OiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hULFxuICAgICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgICAgc3ByaXRlWTogMCxcbiAgICAgIHNwcml0ZVg6IDAsXG4gICAgfSkpO1xuXG4gICAgLy8gUGxheWVyXG4gICAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXJPYmplY3QodGhpcy5zY2VuZSwge30pO1xuICAgIHRoaXMub2JqZWN0cy5wdXNoKHBsYXllcik7XG5cbiAgICB0aGlzLm9iamVjdHMucHVzaChuZXcgQ29udHJvbGxlck9iamVjdCh0aGlzLnNjZW5lLCB7IHBsYXllciwgfSkpO1xuXG4gICAgdGhpcy5vYmplY3RzLnB1c2gobmV3IFNjb3JlT2JqZWN0KHRoaXMuc2NlbmUsIHt9KSk7XG4gICAgdGhpcy5vYmplY3RzLnB1c2gobmV3IEZsb29yT2JqZWN0KHRoaXMuc2NlbmUsIHsgcGxheWVyLCB9KSk7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBERUZBVUxUX1BJUEVfU1BFRUQ6IG51bWJlciA9IDQ7XG5leHBvcnQgY29uc3QgREVGQVVMVF9QTEFZRVJfR1JBVklUWTogbnVtYmVyID0gNDg7XG5leHBvcnQgY29uc3QgREVGQVVMVF9QTEFZRVJfQUNDRUxFUkFUSU9OOiBudW1iZXIgPSAtMTI7XG5leHBvcnQgY29uc3QgREVGQVVMVF9QSVBFX0dBUDogbnVtYmVyID0gMzsgLy8gZ2FwIGJldHdlZW4gcGlwZXNcbmV4cG9ydCBjb25zdCBERUZBVUxUX1BJUEVfUkVHSU9OOiBudW1iZXIgPSA4OyAvLyBvbmx5IGV2ZXIgbW92ZSB3aXRoaW4gWCB0aWxlc1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGVmYXVsdHNDb25zdGFudHMge1xuICBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9QSVBFX1NQRUVEOiBudW1iZXIgPSBERUZBVUxUX1BJUEVfU1BFRUQ7XG4gIHN0YXRpYyByZWFkb25seSBERUZBVUxUX1BMQVlFUl9HUkFWSVRZOiBudW1iZXIgPSBERUZBVUxUX1BMQVlFUl9HUkFWSVRZO1xuICBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9QTEFZRVJfQUNDRUxFUkFUSU9OOiBudW1iZXIgPSBERUZBVUxUX1BMQVlFUl9BQ0NFTEVSQVRJT047XG4gIHN0YXRpYyBERUZBVUxUX1BJUEVfR0FQOiBudW1iZXIgPSBERUZBVUxUX1BJUEVfR0FQO1xuICBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9QSVBFX1JFR0lPTjogbnVtYmVyID0gREVGQVVMVF9QSVBFX1JFR0lPTjtcbn1cbiIsImV4cG9ydCBlbnVtIEdhbWVFdmVudHMge1xuICBHYW1lSWRsZSA9ICdHYW1lSWRsZScsXG4gIEdhbWVTdGFydCA9ICdHYW1lU3RhcnQnLFxuICBHYW1lRW5kID0gJ0dhbWVFbmQnXG59XG4iLCJleHBvcnQgY29uc3QgQlJPTlpFX01FREFMX1RIUkVTSE9MRCA9IDEwO1xuZXhwb3J0IGNvbnN0IFNJTFZFUl9NRURBTF9USFJFU0hPTEQgPSAyMDtcbmV4cG9ydCBjb25zdCBHT0xEX01FREFMX1RIUkVTSE9MRCA9IDMwO1xuZXhwb3J0IGNvbnN0IFBMQVRJTlVNX01FREFMX1RIUkVTSE9MRCA9IDQwO1xuXG5leHBvcnQgdHlwZSBNZWRhbFR5cGUgPSAncGxhdGludW0nIHwgJ2dvbGQnIHwgJ3NpbHZlcicgfCAnYnJvbnplJyB8ICdub25lJztcbiIsImV4cG9ydCBjb25zdCBOVU1CRVJfU1BSSVRFU19NRURJVU06IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gIFsnMCddOiB7IHNwcml0ZVg6IDguNSwgc3ByaXRlWTogMTksIH0sXG4gIFsnMSddOiB7IHNwcml0ZVg6IDguNTYyNSwgc3ByaXRlWTogMjkuNjg3NSwgfSxcbiAgWycyJ106IHsgc3ByaXRlWDogOC41LCBzcHJpdGVZOiAzMC40Mzc1LCB9LFxuICBbJzMnXTogeyBzcHJpdGVYOiA4LjEyNSwgc3ByaXRlWTogMzEuMTg3NSwgfSxcbiAgWyc0J106IHsgc3ByaXRlWDogMzEuMzc1LCBzcHJpdGVZOiAtMC4xMjUsIH0sXG4gIFsnNSddOiB7IHNwcml0ZVg6IDMxLjM3NSwgc3ByaXRlWTogMC42MjUsIH0sXG4gIFsnNiddOiB7IHNwcml0ZVg6IDMxLjUsIHNwcml0ZVk6IDEuNSwgfSxcbiAgWyc3J106IHsgc3ByaXRlWDogMzEuNSwgc3ByaXRlWTogMi41LCB9LFxuICBbJzgnXTogeyBzcHJpdGVYOiAxOC4yNSwgc3ByaXRlWTogMTUsIH0sXG4gIFsnOSddOiB7IHNwcml0ZVg6IDE5LjM3NSwgc3ByaXRlWTogMTIuNzUsIH0sXG59O1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1NQUklURVNfTEFSR0U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gIFsnMCddOiB7IHNwcml0ZVg6IDMwLjg3NSwgc3ByaXRlWTogMy43NSwgfSxcbiAgWycxJ106IHsgc3ByaXRlWDogOC4zNSwgc3ByaXRlWTogMjguNDUsIH0sXG4gIFsnMiddOiB7IHNwcml0ZVg6IDE4LjEyNSwgc3ByaXRlWTogMTAsIH0sXG4gIFsnMyddOiB7IHNwcml0ZVg6IDE5LCBzcHJpdGVZOiAxMCwgfSxcbiAgWyc0J106IHsgc3ByaXRlWDogMTkuODc1LCBzcHJpdGVZOiAxMCwgfSxcbiAgWyc1J106IHsgc3ByaXRlWDogMjAuNzUsIHNwcml0ZVk6IDEwLCB9LFxuICBbJzYnXTogeyBzcHJpdGVYOiAxOC4xMjUsIHNwcml0ZVk6IDExLjUsIH0sXG4gIFsnNyddOiB7IHNwcml0ZVg6IDE5LCBzcHJpdGVZOiAxMS41LCB9LFxuICBbJzgnXTogeyBzcHJpdGVYOiAxOS44NzUsIHNwcml0ZVk6IDExLjUsIH0sXG4gIFsnOSddOiB7IHNwcml0ZVg6IDIwLjc1LCBzcHJpdGVZOiAxMS41LCB9LFxufTtcbiIsImltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBHYW1lRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMnO1xuaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgSW50ZXJ2YWxPYmplY3QgfSBmcm9tICdAY29yZS9vYmplY3RzL2ludGVydmFsLm9iamVjdCc7XG5pbXBvcnQgeyBNYXRoVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9tYXRoLnV0aWxzJztcbmltcG9ydCB7IFBpcGVPYmplY3QgfSBmcm9tICcuL3BpcGUub2JqZWN0JztcbmltcG9ydCB7IFBvaW50T2JqZWN0IH0gZnJvbSAnLi9wb2ludC5vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBQbGF5ZXJPYmplY3QgfSBmcm9tICcuL3BsYXllci5vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgU3ByaXRlT2JqZWN0IH0gZnJvbSAnQGNvcmUvb2JqZWN0cy9zcHJpdGUub2JqZWN0JztcbmltcG9ydCB7IFNjb3JlQ2FyZE9iamVjdCB9IGZyb20gJy4vc2NvcmUtY2FyZC5vYmplY3QnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVBFX0dBUCwgREVGQVVMVF9QSVBFX1JFR0lPTiwgRGVmYXVsdHNDb25zdGFudHMgfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xufVxuXG50eXBlIHN0YXRlID0gJ2lkbGUnIHwgJ3BsYXlpbmcnIHwgJ2dhbWUtb3Zlcic7XG5cbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBzdGF0ZTogc3RhdGU7XG5cbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG5cbiAgLy8gb2JqZWN0IHJlZmVyZW5jZXNcbiAgaW50ZXJ2YWw6IEludGVydmFsT2JqZWN0O1xuICBpZGxlU3ByaXRlOiBTcHJpdGVPYmplY3Q7XG4gIHNjb3JlY2FyZDogU2NvcmVDYXJkT2JqZWN0O1xuXG4gIC8vIGdhbWUgZW5kXG4gIGNvbnRpbnVlVGltZXI6IG51bWJlciA9IDA7XG4gIGNvbnRpbnVlRHVyYXRpb246IG51bWJlciA9IDAuNTsgLy8gc2Vjb25kcyBiZWZvcmUgY2FuIGNvbnRpbnVlXG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5ZXIgPSBjb25maWcucGxheWVyO1xuXG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUlkbGUsIHRoaXMub25HYW1lSWRsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lU3RhcnQsIHRoaXMub25HYW1lU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUVuZCwgdGhpcy5vbkdhbWVFbmQuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNjZW5lLmRpc3BhdGNoRXZlbnQoR2FtZUV2ZW50cy5HYW1lSWRsZSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgIHRoaXMudXBkYXRlR2FtZUlkbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnYW1lLW92ZXInOlxuICAgICAgICB0aGlzLnVwZGF0ZUdhbWVFbmQoZGVsdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZUlkbGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09ICdpZGxlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYW51cEdhbWVFbmQoKTtcblxuICAgIHRoaXMuc3RhdGUgPSAnaWRsZSc7XG5cbiAgICB0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUgPSAwO1xuXG4gICAgLy8gdmFsdWVzIGhlcmUgYXJlIGF3a3dhcmRseSBoYXJkY29kZWRcbiAgICBsZXQgc3ByaXRlV2lkdGggPSAzLjY3NTtcbiAgICBsZXQgc3ByaXRlSGVpZ2h0ID0gMy41O1xuICAgIHRoaXMuaWRsZVNwcml0ZSA9IG5ldyBTcHJpdGVPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgcG9zaXRpb25YOiAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIIC8gMikgLSAoc3ByaXRlV2lkdGggLyAyKSArIDAuMDUsXG4gICAgICBwb3NpdGlvblk6IChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC8gMikgLSAwLjgsXG4gICAgICB3aWR0aDogc3ByaXRlV2lkdGgsXG4gICAgICBoZWlnaHQ6IHNwcml0ZUhlaWdodCxcbiAgICAgIHRpbGVzZXQ6ICdzcHJpdGVzJyxcbiAgICAgIHNwcml0ZVg6IDE4LjI1LFxuICAgICAgc3ByaXRlWTogNS4yNSxcbiAgICAgIHJlbmRlckxheWVyOiBDYW52YXNDb25zdGFudHMuVUlfQ09MTElTSU9OX0xBWUVSLFxuICAgIH0pO1xuICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KHRoaXMuaWRsZVNwcml0ZSk7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZVN0YXJ0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAncGxheWluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9ICdwbGF5aW5nJztcblxuICAgIGlmICh0aGlzLmlkbGVTcHJpdGUpIHtcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0QnlJZCh0aGlzLmlkbGVTcHJpdGUuaWQpO1xuICAgIH1cblxuICAgIHRoaXMuaW50ZXJ2YWwgPSBuZXcgSW50ZXJ2YWxPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgZHVyYXRpb246IDIsXG4gICAgICBvbkludGVydmFsOiAoKSA9PiB7XG4gICAgICAgIGxldCByZWdpb24gPSBERUZBVUxUX1BJUEVfUkVHSU9OO1xuICAgICAgICBsZXQgZ2FwID0gRGVmYXVsdHNDb25zdGFudHMuREVGQVVMVF9QSVBFX0dBUDtcbiAgICAgICAgbGV0IG1pbiA9IChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC8gMikgLSAocmVnaW9uIC8gMik7XG4gICAgICAgIGxldCBtYXggPSBtaW4gKyAocmVnaW9uIC8gMik7XG5cbiAgICAgICAgbGV0IGhlaWdodCA9IE1hdGhVdGlscy5yYW5kb21OdW1iZXJGcm9tUmFuZ2UobWluLCBtYXgpO1xuXG4gICAgICAgIC8vIFBpcGVzXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KG5ldyBQaXBlT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgICAgICBwbGF5ZXI6IHRoaXMucGxheWVyLFxuICAgICAgICAgIHR5cGU6ICd0b3AnLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KG5ldyBQaXBlT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgICAgICBwbGF5ZXI6IHRoaXMucGxheWVyLFxuICAgICAgICAgIHR5cGU6ICdib3R0b20nLFxuICAgICAgICAgIGhlaWdodDogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAtIGhlaWdodCAtIGdhcCxcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIHBvaW50XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KG5ldyBQb2ludE9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICAgICAgcGxheWVyOiB0aGlzLnBsYXllcixcbiAgICAgICAgfSkpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLnNjZW5lLmFkZE9iamVjdCh0aGlzLmludGVydmFsKTtcbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lRW5kKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAnZ2FtZS1vdmVyJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0gJ2dhbWUtb3Zlcic7XG5cbiAgICAvLyBUT0RPKHNtZyk6IG1vdmUgY2xlYW51cCBvZiBwcmV2aW91cyBzdGF0ZSB0byBpdCdzIG93biBmdW5jdGlvblxuICAgIGlmICh0aGlzLmludGVydmFsKSB7XG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdEJ5SWQodGhpcy5pbnRlcnZhbC5pZCk7XG4gICAgfVxuXG4gICAgLy8gc2NvcmVjYXJkXG4gICAgdGhpcy5zY29yZWNhcmQgPSBuZXcgU2NvcmVDYXJkT2JqZWN0KHRoaXMuc2NlbmUsIHt9KTtcbiAgICB0aGlzLnNjZW5lLmFkZE9iamVjdCh0aGlzLnNjb3JlY2FyZCk7XG5cbiAgICAvLyBzZXQgaGlnaHNjb3JlXG4gICAgaWYgKHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZSA+IHRoaXMuc2NlbmUuZ2xvYmFscy5oaWdoc2NvcmUpIHtcbiAgICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5oaWdoc2NvcmUgPSB0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmU7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaGlnaHNjb3JlJywgdGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHRoaXMuY29udGludWVUaW1lciA9IDA7XG4gIH1cblxuICBwcml2YXRlIGNsZWFudXBHYW1lRW5kKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNjb3JlY2FyZCkge1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3RCeUlkKHRoaXMuc2NvcmVjYXJkLmlkKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVHYW1lRW5kKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRpbnVlVGltZXIgKz0gZGVsdGE7XG4gICAgY29uc29sZS5sb2codGhpcy5jb250aW51ZVRpbWVyKTtcblxuICAgIGlmICh0aGlzLmNvbnRpbnVlVGltZXIgPCB0aGlzLmNvbnRpbnVlRHVyYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc2NlbmUuZ2xvYmFscy5rZXlib2FyZFsnICddICYmICF0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5rZXlib2FyZFsnICddID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSBmYWxzZTtcblxuICAgIHRoaXMuc2NlbmUuZGlzcGF0Y2hFdmVudChHYW1lRXZlbnRzLkdhbWVJZGxlKTtcbiAgfVxuXG4gIHVwZGF0ZUdhbWVJZGxlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gJiYgIXRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gPSBmYWxzZTtcbiAgICB0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZVN0YXJ0KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZSB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIFBsYXllck9iamVjdCB9IGZyb20gJy4vcGxheWVyLm9iamVjdCc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyBHYW1lRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVBFX1NQRUVEIH0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHRzLmNvbnN0YW50cyc7XG5cbmNvbnN0IERFRkFVTFRfUkVOREVSX0xBWUVSID0gMTA7XG5jb25zdCBTRUdNRU5UX1dJRFRIID0gMi4yNTsgLy8gd2lkdGggb2YgdGhlIGZsb29yIHNlZ21lbnRcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xufVxuXG5leHBvcnQgY2xhc3MgRmxvb3JPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG4gIHJlbmRlckxheWVyID0gREVGQVVMVF9SRU5ERVJfTEFZRVI7XG5cbiAgb2Zmc2V0OiBudW1iZXIgPSAwO1xuXG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xuXG4gIGNoZWNrQ29sbGlzaW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgbW92aW5nRmxvb3I6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IFNjZW5lLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgLy8gY29uZmlnXG4gICAgdGhpcy5wbGF5ZXIgPSBjb25maWcucGxheWVyO1xuXG4gICAgLy8gc2V0dXBcbiAgICB0aGlzLmhlaWdodCA9IDI7XG4gICAgdGhpcy53aWR0aCA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSDtcbiAgICB0aGlzLnBvc2l0aW9uWCA9IDA7XG4gICAgdGhpcy5wb3NpdGlvblkgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC0gdGhpcy5oZWlnaHQ7XG5cbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lU3RhcnQsIHRoaXMub25HYW1lU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUVuZCwgdGhpcy5vbkdhbWVPdmVyLmJpbmQodGhpcykpO1xuICB9XG5cbiAgdXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbikge1xuICAgICAgdGhpcy51cGRhdGVDaGVja0lmUGxheWVyQWJvdmVHcm91bmQoZGVsdGEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZ0Zsb29yKSB7XG4gICAgICB0aGlzLm9mZnNldCArPSBkZWx0YSAqIERFRkFVTFRfUElQRV9TUEVFRDtcbiAgICAgIHRoaXMub2Zmc2V0ICU9IFNFR01FTlRfV0lEVEg7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyRmxvb3IoY29udGV4dCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNoZWNrSWZQbGF5ZXJBYm92ZUdyb3VuZChkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGxheWVyLnBvc2l0aW9uWSArIHRoaXMucGxheWVyLmhlaWdodCA8IHRoaXMucG9zaXRpb25ZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZUVuZCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckZsb29yKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIICsgU0VHTUVOVF9XSURUSDsgaSArPSBTRUdNRU5UX1dJRFRIKSB7XG4gICAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIHRoaXMuYXNzZXRzLmltYWdlcy5zcHJpdGVzLFxuICAgICAgICAxOSxcbiAgICAgICAgMCxcbiAgICAgICAgdGhpcy5wb3NpdGlvblggKyBpIC0gdGhpcy5vZmZzZXQsXG4gICAgICAgIHRoaXMucG9zaXRpb25ZLFxuICAgICAgICBTRUdNRU5UX1dJRFRILFxuICAgICAgICB0aGlzLmhlaWdodFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZVN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tDb2xsaXNpb24gPSB0cnVlO1xuICAgIHRoaXMubW92aW5nRmxvb3IgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVPdmVyKCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tDb2xsaXNpb24gPSBmYWxzZTtcbiAgICB0aGlzLm1vdmluZ0Zsb29yID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyB0eXBlIFBsYXllck9iamVjdCB9IGZyb20gJy4vcGxheWVyLm9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIEdBTUVfU0NFTkUgfSBmcm9tICdAZmxhcHB5LWJpcmQvc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBERUZBVUxUX1BJUEVfU1BFRUQgfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzJztcbmltcG9ydCB7IEdhbWVFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMvZXZlbnRzLmNvbnN0YW50cyc7XG5cbmNvbnN0IFNQUklURVMgPSB7XG4gIFRvcEV4aXQ6IHtcbiAgICB3aWR0aDogMS42MjUsXG4gICAgaGVpZ2h0OiAwLjgxMjUsXG4gICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgIHNwcml0ZVg6IDUuMjUsXG4gICAgc3ByaXRlWTogMjAuMTg3NSxcbiAgfSxcbiAgUGlwZToge1xuICAgIHdpZHRoOiAxLjYyNSxcbiAgICBoZWlnaHQ6IDAuODEyNSxcbiAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgc3ByaXRlWDogNS4yNSxcbiAgICBzcHJpdGVZOiAyOS4zNzUsXG4gIH0sXG4gIEJvdHRvbUV4aXQ6IHtcbiAgICB3aWR0aDogMS42MjUsXG4gICAgaGVpZ2h0OiAwLjgxMjUsXG4gICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgIHNwcml0ZVg6IDMuNSxcbiAgICBzcHJpdGVZOiAyOS4zNzUsXG4gIH0sXG59O1xuXG50eXBlIFBpcGVUeXBlID0gJ3RvcCcgfCAnYm90dG9tJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xuICB0eXBlOiBQaXBlVHlwZTtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuXG4gIHdpZHRoID0gMS42MjU7XG4gIHR5cGU6IFBpcGVUeXBlO1xuXG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xuXG4gIGNhbk1vdmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMucGxheWVyID0gY29uZmlnLnBsYXllcjtcbiAgICB0aGlzLnR5cGUgPSBjb25maWcudHlwZTtcbiAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XG5cbiAgICB0aGlzLnBvc2l0aW9uWSA9IHRoaXMudHlwZSA9PT0gJ3RvcCcgPyAwIDogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAtIHRoaXMuaGVpZ2h0O1xuICAgIHRoaXMucG9zaXRpb25YID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIICsgMTtcblxuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVJZGxlLCB0aGlzLm9uR2FtZUlkbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUVuZCwgdGhpcy5vbkdhbWVFbmQuYmluZCh0aGlzKSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oZGVsdGEpO1xuICAgICAgdGhpcy51cGRhdGVDb2xsaWRpbmdXaXRoUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgIHRoaXMucmVuZGVyVG9wUGlwZShjb250ZXh0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICB0aGlzLnJlbmRlckJvdHRvbVBpcGUoY29udGV4dCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9zaXRpb24oZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIG1vdmUgZnJvbSBsZWZ0IG9mIHNjcmVlbiB0byB0aGUgcmlnaHRcbiAgICB0aGlzLnBvc2l0aW9uWCAtPSAoREVGQVVMVF9QSVBFX1NQRUVEICogZGVsdGEpO1xuXG4gICAgLy8gd2hlbiBvZmYgc2NyZWVuLCByZW1vdmUgcGlwZVxuICAgIGlmICh0aGlzLnBvc2l0aW9uWCA8IC0zKSB7XG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNvbGxpZGluZ1dpdGhQbGF5ZXIoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIGlmIHBsYXllciBjb2xsaWRlcyB3aXRoIHBpcGVcbiAgICBpZiAodGhpcy5pc0NvbGxpZGluZ1dpdGgodGhpcy5wbGF5ZXIpKSB7XG4gICAgICB0aGlzLnNjZW5lLmRpc3BhdGNoRXZlbnQoR2FtZUV2ZW50cy5HYW1lRW5kKTtcbiAgICB9XG5cbiAgICAvLyBpZiBwbGF5ZXIgaXMgb2ZmIHRvcCBvZiBzY3JlZW4gcGFzc2VzIG92ZXIgcGlwZVxuICAgIGlmICh0aGlzLnBsYXllci5wb3NpdGlvblkgPCAwICYmIHRoaXMuaXNXaXRoaW5Ib3Jpem9udGFsQm91bmRzKHRoaXMucGxheWVyKSkge1xuICAgICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZUVuZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJUb3BQaXBlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIC8vIHJlcGVhdCBwaXBlIHVudGlsIG9mZiBzY3JlZW5cbiAgICBmb3IgKGxldCBpID0gdGhpcy5oZWlnaHQgLSBTUFJJVEVTLkJvdHRvbUV4aXQuaGVpZ2h0OyBpID49IC0zOyBpIC09IFNQUklURVMuUGlwZS5oZWlnaHQpIHtcbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzWydzcHJpdGVzJ10sXG4gICAgICAgIFNQUklURVMuUGlwZS5zcHJpdGVYLFxuICAgICAgICBTUFJJVEVTLlBpcGUuc3ByaXRlWSxcbiAgICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICAgIHRoaXMucG9zaXRpb25ZICsgaSxcbiAgICAgICAgU1BSSVRFUy5QaXBlLndpZHRoLFxuICAgICAgICBTUFJJVEVTLlBpcGUuaGVpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbJ3Nwcml0ZXMnXSxcbiAgICAgIFNQUklURVMuQm90dG9tRXhpdC5zcHJpdGVYLFxuICAgICAgU1BSSVRFUy5Cb3R0b21FeGl0LnNwcml0ZVksXG4gICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgIHRoaXMucG9zaXRpb25ZICsgdGhpcy5oZWlnaHQgLSBTUFJJVEVTLkJvdHRvbUV4aXQuaGVpZ2h0LFxuICAgICAgU1BSSVRFUy5Cb3R0b21FeGl0LndpZHRoLFxuICAgICAgU1BSSVRFUy5Cb3R0b21FeGl0LmhlaWdodFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckJvdHRvbVBpcGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgY29udGV4dCxcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1snc3ByaXRlcyddLFxuICAgICAgU1BSSVRFUy5Ub3BFeGl0LnNwcml0ZVgsXG4gICAgICBTUFJJVEVTLlRvcEV4aXQuc3ByaXRlWSxcbiAgICAgIHRoaXMucG9zaXRpb25YLFxuICAgICAgdGhpcy5wb3NpdGlvblksXG4gICAgICBTUFJJVEVTLlRvcEV4aXQud2lkdGgsXG4gICAgICBTUFJJVEVTLlRvcEV4aXQuaGVpZ2h0XG4gICAgKTtcblxuICAgIC8vIHJlcGVhdCBwaXBlIHVudGlsIG9mZiBzY3JlZW5cbiAgICBmb3IgKGxldCBpID0gU1BSSVRFUy5Ub3BFeGl0LmhlaWdodDsgaSA8IHRoaXMuaGVpZ2h0OyBpICs9IFNQUklURVMuUGlwZS5oZWlnaHQpIHtcbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzWydzcHJpdGVzJ10sXG4gICAgICAgIFNQUklURVMuUGlwZS5zcHJpdGVYLFxuICAgICAgICBTUFJJVEVTLlBpcGUuc3ByaXRlWSxcbiAgICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICAgIHRoaXMucG9zaXRpb25ZICsgaSxcbiAgICAgICAgU1BSSVRFUy5QaXBlLndpZHRoLFxuICAgICAgICBTUFJJVEVTLlBpcGUuaGVpZ2h0XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lSWRsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdEJ5SWQodGhpcy5pZCk7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZUVuZCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IFNwcml0ZUFuaW1hdGlvbiB9IGZyb20gJ0Bjb3JlL21vZGVsL3Nwcml0ZS1hbmltYXRpb24nO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuaW1wb3J0IHsgREVGQVVMVF9QTEFZRVJfR1JBVklUWSwgREVGQVVMVF9QTEFZRVJfQUNDRUxFUkFUSU9OIH0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHRzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBHYW1lRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMnO1xuXG5jb25zdCBERUZBVUxUX0FOSU1BVElPTlM6IFJlY29yZDxzdHJpbmcsIFNwcml0ZUFuaW1hdGlvbj4gPSB7XG4gIGRlZmF1bHQ6IG5ldyBTcHJpdGVBbmltYXRpb24oJ3Nwcml0ZXMnLCBbXG4gICAgeyBzcHJpdGVYOiAwLjE4NzUsIHNwcml0ZVk6IDMwLjY4NzUsIGR1cmF0aW9uOiAwLjA2MjUsIH0sIC8vIDBcbiAgICB7IHNwcml0ZVg6IDEuOTM3NSwgc3ByaXRlWTogMzAuNjg3NSwgZHVyYXRpb246IDAuMDYyNSwgfSwgLy8gMVxuICAgIHsgc3ByaXRlWDogMy42ODc1LCBzcHJpdGVZOiAzMC42ODc1LCBkdXJhdGlvbjogMC4wNjI1LCB9LCAvLyAyXG4gICAgeyBzcHJpdGVYOiAxLjkzNzUsIHNwcml0ZVk6IDMwLjY4NzUsIGR1cmF0aW9uOiAwLjA2MjUsIH0gLy8gMVxuICBdKSxcbn07XG5cbnR5cGUgc3RhdGUgPSAnaWRsZScgfCAncGxheWluZycgfCAnZ2FtZS1vdmVyJztcblxuY29uc3QgREVGQVVMVF9SRU5ERVJfTEFZRVI6IG51bWJlciA9IDEyO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcblxufVxuXG5leHBvcnQgY2xhc3MgUGxheWVyT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuICByZW5kZXJMYXllciA9IERFRkFVTFRfUkVOREVSX0xBWUVSO1xuXG4gIHdpZHRoID0gMS4wNjI1OyAvLyAxN3B4XG4gIGhlaWdodCA9IDAuNzU7IC8vIDEycHhcblxuICBzdGF0ZTogc3RhdGU7XG5cbiAgLy8gbW92ZW1lbnRcbiAgc3BlZWQ6IG51bWJlciA9IDA7XG5cbiAgLy8gYW5pbWF0aW9uc1xuICBhbmltYXRpb25FbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgYW5pbWF0aW9uczogUmVjb3JkPHN0cmluZywgU3ByaXRlQW5pbWF0aW9uPjtcbiAgYW5pbWF0aW9uID0ge1xuICAgIGluZGV4OiAwLFxuICAgIHRpbWVyOiAwLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMucG9zaXRpb25YID0gdGhpcy5zdGFydGluZ1g7XG4gICAgdGhpcy5wb3NpdGlvblkgPSB0aGlzLnN0YXJ0aW5nWTtcblxuICAgIHRoaXMuYW5pbWF0aW9ucyA9IERFRkFVTFRfQU5JTUFUSU9OUztcblxuICAgIHRoaXMuc3RhdGUgPSAncGxheWluZyc7XG5cbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lSWRsZSwgdGhpcy5vbkdhbWVJZGxlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVTdGFydCwgdGhpcy5vbkdhbWVTdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lRW5kLCB0aGlzLm9uR2FtZU92ZXIuYmluZCh0aGlzKSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgIC8vIHRoaXMudXBkYXRlUGxheWluZyhkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGxheWluZyc6XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWluZyhkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZ2FtZS1vdmVyJzpcbiAgICAgICAgdGhpcy51cGRhdGVHYW1lT3ZlcihkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUGxheWluZyhkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVHcmF2aXR5KGRlbHRhKTtcbiAgICB0aGlzLnVwZGF0ZUZsYXAoZGVsdGEpO1xuICAgIHRoaXMucG9zaXRpb25ZICs9ICh0aGlzLnNwZWVkICogZGVsdGEpO1xuICAgIHRoaXMudXBkYXRlQW5pbWF0aW9uVGltZXIoZGVsdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVHYW1lT3ZlcihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gZmFsbCB0b3dhcmRzIGdyb3VuZCBpZiBub3QgYXQgZ3JvdW5kXG4gICAgaWYgKHRoaXMucG9zaXRpb25ZID4gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAtIDMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNwZWVkICs9IChERUZBVUxUX1BMQVlFUl9HUkFWSVRZICogZGVsdGEpO1xuICAgIHRoaXMucG9zaXRpb25ZICs9ICh0aGlzLnNwZWVkICogZGVsdGEpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyUGxheWVyKGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVHcmF2aXR5KGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNwZWVkICs9IChERUZBVUxUX1BMQVlFUl9HUkFWSVRZICogZGVsdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVGbGFwKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ICYmICF0aGlzLnNjZW5lLmdsb2JhbHMua2V5Ym9hcmRbJyAnXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gPSBmYWxzZTtcblxuICAgIC8vIGlmIGZhbGxpbmcsIHJlc2V0IHNwZWVkIHRvIDBcbiAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcbiAgICAgIHRoaXMuc3BlZWQgPSAwO1xuICAgIH1cbiAgICB0aGlzLnNwZWVkICs9IERFRkFVTFRfUExBWUVSX0FDQ0VMRVJBVElPTjtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQW5pbWF0aW9uVGltZXIoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5hbmltYXRpb25FbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hbmltYXRpb24udGltZXIgPSAodGhpcy5hbmltYXRpb24udGltZXIgKyBkZWx0YSkgJSB0aGlzLmFuaW1hdGlvbnNbJ2RlZmF1bHQnXS5kdXJhdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUGxheWVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGxldCBhbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbnNbJ2RlZmF1bHQnXTtcbiAgICBsZXQgZnJhbWUgPSBhbmltYXRpb24uY3VycmVudEZyYW1lKHRoaXMuYW5pbWF0aW9uLnRpbWVyKTtcblxuICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbYW5pbWF0aW9uLnRpbGVzZXRdLFxuICAgICAgZnJhbWUuc3ByaXRlWCxcbiAgICAgIGZyYW1lLnNwcml0ZVksXG4gICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgIHRoaXMucG9zaXRpb25ZLFxuICAgICAgdGhpcy53aWR0aCxcbiAgICAgIHRoaXMuaGVpZ2h0XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lSWRsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlID0gJ2lkbGUnO1xuICAgIHRoaXMucG9zaXRpb25YID0gdGhpcy5zdGFydGluZ1g7XG4gICAgdGhpcy5wb3NpdGlvblkgPSB0aGlzLnN0YXJ0aW5nWTtcbiAgICB0aGlzLnNwZWVkID0gMDtcbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lU3RhcnQoKTogdm9pZCB7XG4gICAgLy8gc3RhcnQgd2l0aCBwbGF5ZXIgbW92aW5nIHVwd2FyZHNcbiAgICB0aGlzLnNwZWVkID0gREVGQVVMVF9QTEFZRVJfQUNDRUxFUkFUSU9OO1xuICAgIHRoaXMuc3RhdGUgPSAncGxheWluZyc7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZU92ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZSA9ICdnYW1lLW92ZXInO1xuICB9XG5cbiAgZ2V0IHN0YXJ0aW5nWCgpOiBudW1iZXIge1xuICAgIHJldHVybiAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIIC8gMikgLSAodGhpcy53aWR0aCAvIDIpO1xuICB9XG5cbiAgZ2V0IHN0YXJ0aW5nWSgpOiBudW1iZXIge1xuICAgIHJldHVybiAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAvIDIpIC0gKHRoaXMuaGVpZ2h0IC8gMik7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIFBsYXllck9iamVjdCB9IGZyb20gJy4vcGxheWVyLm9iamVjdCc7XG5pbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyB0eXBlIEdBTUVfU0NFTkUgfSBmcm9tICdAZmxhcHB5LWJpcmQvc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBHYW1lRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVBFX1NQRUVEIH0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHRzLmNvbnN0YW50cyc7XG5cbmludGVyZmFjZSBDb25maWcgZXh0ZW5kcyBTY2VuZU9iamVjdEJhc2VDb25maWcge1xuICBwbGF5ZXI6IFBsYXllck9iamVjdDtcbn1cblxuZXhwb3J0IGNsYXNzIFBvaW50T2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuXG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xuXG4gIHdpZHRoOiBudW1iZXIgPSAwLjA2MjU7XG4gIGhlaWdodDogbnVtYmVyID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IEdBTUVfU0NFTkUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc2NlbmUsIGNvbmZpZyk7XG5cbiAgICB0aGlzLnBsYXllciA9IGNvbmZpZy5wbGF5ZXI7XG4gICAgdGhpcy5wb3NpdGlvblggPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggKyAyLjYyNTtcblxuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVFbmQsIHRoaXMub25HYW1lT3Zlci5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHVwZGF0ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVQb3NpdGlvbihkZWx0YSk7XG4gICAgdGhpcy51cGRhdGVQb2ludHMoZGVsdGEpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuXG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvc2l0aW9uKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBtb3ZlIGZyb20gbGVmdCBvZiBzY3JlZW4gdG8gdGhlIHJpZ2h0XG4gICAgdGhpcy5wb3NpdGlvblggLT0gKERFRkFVTFRfUElQRV9TUEVFRCAqIGRlbHRhKTtcblxuICAgIC8vIHdoZW4gb2ZmIHNjcmVlbiwgcmVtb3ZlIHBpcGVcbiAgICBpZiAodGhpcy5wb3NpdGlvblggPCAtMykgeyAvLyAzIGlzIGFyYml0cmFyeSBoZXJlLCBjb3VsZCBiZSBhIGJldHRlciB2YWx1ZVxuICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3QodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludHMoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uWCA8IHRoaXMucGxheWVyLnBvc2l0aW9uWCkge1xuICAgICAgdGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlKys7XG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZU92ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3RCeUlkKHRoaXMuaWQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgU3ByaXRlT2JqZWN0IH0gZnJvbSAnQGNvcmUvb2JqZWN0cy9zcHJpdGUub2JqZWN0JztcbmltcG9ydCB7IE5VTUJFUl9TUFJJVEVTX01FRElVTSB9IGZyb20gJy4uL2NvbnN0YW50cy9zcHJpdGUuY29uc3RhbnRzJztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IEJST05aRV9NRURBTF9USFJFU0hPTEQsIEdPTERfTUVEQUxfVEhSRVNIT0xELCB0eXBlIE1lZGFsVHlwZSwgUExBVElOVU1fTUVEQUxfVEhSRVNIT0xELCBTSUxWRVJfTUVEQUxfVEhSRVNIT0xEIH0gZnJvbSAnLi4vY29uc3RhbnRzL21lZGFsLmNvbnN0YW50cyc7XG5cbmNvbnN0IE1FREFMX1NQUklURVMgPSB7XG4gIGJyb256ZTogeyBzcHJpdGVYOiA3LCBzcHJpdGVZOiAyOS43NSwgfSxcbiAgc2lsdmVyOiB7IHNwcml0ZVg6IDcsIHNwcml0ZVk6IDI4LjI1LCB9LFxuICBnb2xkOiB7IHNwcml0ZVg6IDcuNSwgc3ByaXRlWTogMTcuNSwgfSxcbiAgcGxhdGludW06IHsgc3ByaXRlWDogNy41LCBzcHJpdGVZOiAxNiwgfSxcbn07XG5cbmludGVyZmFjZSBDb25maWcgZXh0ZW5kcyBTY2VuZU9iamVjdEJhc2VDb25maWcge31cblxuZXhwb3J0IGNsYXNzIFNjb3JlQ2FyZE9iamVjdCBleHRlbmRzIFNjZW5lT2JqZWN0IHtcbiAgaXNSZW5kZXJhYmxlID0gdHJ1ZTtcbiAgcmVuZGVyTGF5ZXIgPSBDYW52YXNDb25zdGFudHMuVUlfQ09MTElTSU9OX0xBWUVSO1xuXG4gIC8vIG9iamVjdCByZWZlcmVuY2VzXG4gIGJhY2tncm91bmQ6IFNwcml0ZU9iamVjdDtcbiAgbWVkYWw6IFNwcml0ZU9iamVjdDtcbiAgaGlnaHNjb3JlOiBTcHJpdGVPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgLy8gYmFja2dyb3VuZFxuICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuY3JlYXRlQmFja2dyb3VuZCgpO1xuICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KHRoaXMuYmFja2dyb3VuZCk7XG5cbiAgICAvLyBtZWRhbFxuICAgIGlmICh0aGlzLm1lZGFsVHlwZSAhPT0gJ25vbmUnKSB7XG4gICAgICB0aGlzLm1lZGFsID0gdGhpcy5jcmVhdGVNZWRhbCh0aGlzLm1lZGFsVHlwZSk7XG4gICAgICB0aGlzLnNjZW5lLmFkZE9iamVjdCh0aGlzLm1lZGFsKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJTY29yZShjb250ZXh0KTtcbiAgICB0aGlzLnJlbmRlclNjb3JlSGlnaHNjb3JlKGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVCYWNrZ3JvdW5kKCk6IFNwcml0ZU9iamVjdCB7XG4gICAgbGV0IHNwcml0ZVdpZHRoID0gNy41O1xuICAgIGxldCBzcHJpdGVIZWlnaHQgPSA0O1xuXG4gICAgcmV0dXJuIG5ldyBTcHJpdGVPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgcG9zaXRpb25YOiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX0NFTlRFUl9USUxFX1ggLSAoc3ByaXRlV2lkdGggLyAyKSxcbiAgICAgIHBvc2l0aW9uWTogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19DRU5URVJfVElMRV9ZIC0gKHNwcml0ZUhlaWdodCAvIDIpLFxuICAgICAgd2lkdGg6IHNwcml0ZVdpZHRoLFxuICAgICAgaGVpZ2h0OiBzcHJpdGVIZWlnaHQsXG4gICAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgICBzcHJpdGVYOiAwLFxuICAgICAgc3ByaXRlWTogMTYsXG4gICAgICByZW5kZXJMYXllcjogQ2FudmFzQ29uc3RhbnRzLlVJX0NPTExJU0lPTl9MQVlFUixcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlTWVkYWwobWVkYWw6IE1lZGFsVHlwZSk6IFNwcml0ZU9iamVjdCB7XG4gICAgbGV0IHNwcml0ZVdpZHRoID0gMS41O1xuICAgIGxldCBzcHJpdGVIZWlnaHQgPSAxLjU7XG5cbiAgICBpZiAobWVkYWwgPT09ICdub25lJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3ByaXRlT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgIHBvc2l0aW9uWDogdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uWCArIDEsXG4gICAgICBwb3NpdGlvblk6IHRoaXMuYmFja2dyb3VuZC5wb3NpdGlvblkgKyAxLjM3NSxcbiAgICAgIHdpZHRoOiBzcHJpdGVXaWR0aCxcbiAgICAgIGhlaWdodDogc3ByaXRlSGVpZ2h0LFxuICAgICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgICAgc3ByaXRlWDogTUVEQUxfU1BSSVRFU1ttZWRhbF0uc3ByaXRlWCxcbiAgICAgIHNwcml0ZVk6IE1FREFMX1NQUklURVNbbWVkYWxdLnNwcml0ZVksXG4gICAgICByZW5kZXJMYXllcjogQ2FudmFzQ29uc3RhbnRzLlVJX0NPTExJU0lPTl9MQVlFUixcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU2NvcmUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgbGV0IHNjb3JlID0gdGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuXG4gICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuYmFja2dyb3VuZC5wb3NpdGlvblggKyB0aGlzLmJhY2tncm91bmQud2lkdGggLSAxLjU7XG4gICAgbGV0IHBvc2l0aW9uWSA9IHRoaXMuYmFja2dyb3VuZC5wb3NpdGlvblkgKyAxLjEyNTtcblxuICAgIGxldCBzcHJpdGVXaWR0aCA9IDAuNTtcbiAgICBsZXQgeE9mZnNldCA9IDAuMDYyNTtcbiAgICBsZXQgc3ByaXRlSGVpZ2h0ID0gMC43NTtcblxuICAgIGxldCBzdGFydCA9IChzY29yZS5sZW5ndGggLSAxKSAqIChzcHJpdGVXaWR0aCArIHhPZmZzZXQpO1xuXG4gICAgc2NvcmUuZm9yRWFjaCgoZGlnaXQsIGluZGV4KSA9PiB7XG4gICAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIHRoaXMuYXNzZXRzLmltYWdlcy5zcHJpdGVzLFxuICAgICAgICBOVU1CRVJfU1BSSVRFU19NRURJVU1bZGlnaXRdLnNwcml0ZVgsXG4gICAgICAgIE5VTUJFUl9TUFJJVEVTX01FRElVTVtkaWdpdF0uc3ByaXRlWSxcbiAgICAgICAgKHBvc2l0aW9uWCAtIHN0YXJ0KSArICgoc3ByaXRlV2lkdGggKyB4T2Zmc2V0KSAqIGluZGV4KSxcbiAgICAgICAgcG9zaXRpb25ZLFxuICAgICAgICBzcHJpdGVXaWR0aCxcbiAgICAgICAgc3ByaXRlSGVpZ2h0XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTY29yZUhpZ2hzY29yZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBsZXQgc2NvcmUgPSB0aGlzLnNjZW5lLmdsb2JhbHMuaGlnaHNjb3JlLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuXG4gICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuYmFja2dyb3VuZC5wb3NpdGlvblggKyB0aGlzLmJhY2tncm91bmQud2lkdGggLSAxLjU7XG4gICAgbGV0IHBvc2l0aW9uWSA9IHRoaXMuYmFja2dyb3VuZC5wb3NpdGlvblkgKyAxLjEyNTtcblxuICAgIGxldCBzcHJpdGVXaWR0aCA9IDAuNTtcbiAgICBsZXQgeE9mZnNldCA9IDAuMDYyNTtcbiAgICBsZXQgc3ByaXRlSGVpZ2h0ID0gMC43NTtcblxuICAgIGxldCBzdGFydCA9IChzY29yZS5sZW5ndGggLSAxKSAqIChzcHJpdGVXaWR0aCArIHhPZmZzZXQpO1xuXG4gICAgc2NvcmUuZm9yRWFjaCgoZGlnaXQsIGluZGV4KSA9PiB7XG4gICAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIHRoaXMuYXNzZXRzLmltYWdlcy5zcHJpdGVzLFxuICAgICAgICBOVU1CRVJfU1BSSVRFU19NRURJVU1bZGlnaXRdLnNwcml0ZVgsXG4gICAgICAgIE5VTUJFUl9TUFJJVEVTX01FRElVTVtkaWdpdF0uc3ByaXRlWSxcbiAgICAgICAgKHBvc2l0aW9uWCAtIHN0YXJ0KSArICgoc3ByaXRlV2lkdGggKyB4T2Zmc2V0KSAqIGluZGV4KSxcbiAgICAgICAgcG9zaXRpb25ZICsgMS41LFxuICAgICAgICBzcHJpdGVXaWR0aCxcbiAgICAgICAgc3ByaXRlSGVpZ2h0XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IG1lZGFsVHlwZSgpOiBNZWRhbFR5cGUge1xuICAgIGlmICh0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUgPj0gUExBVElOVU1fTUVEQUxfVEhSRVNIT0xEKSB7XG4gICAgICByZXR1cm4gJ3BsYXRpbnVtJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlID49IEdPTERfTUVEQUxfVEhSRVNIT0xEKSB7XG4gICAgICByZXR1cm4gJ2dvbGQnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUgPj0gU0lMVkVSX01FREFMX1RIUkVTSE9MRCkge1xuICAgICAgcmV0dXJuICdzaWx2ZXInO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUgPj0gQlJPTlpFX01FREFMX1RIUkVTSE9MRCkge1xuICAgICAgcmV0dXJuICdicm9uemUnO1xuICAgIH1cblxuICAgIHJldHVybiAnbm9uZSc7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0QnlJZCh0aGlzLmJhY2tncm91bmQuaWQpO1xuICAgIGlmICh0aGlzLm1lZGFsKSB7XG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdEJ5SWQodGhpcy5tZWRhbC5pZCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuaW1wb3J0IHsgTlVNQkVSX1NQUklURVNfTEFSR0UgfSBmcm9tICcuLi9jb25zdGFudHMvc3ByaXRlLmNvbnN0YW50cyc7XG5cbmludGVyZmFjZSBDb25maWcgZXh0ZW5kcyBTY2VuZU9iamVjdEJhc2VDb25maWcge31cblxuZXhwb3J0IGNsYXNzIFNjb3JlT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuICByZW5kZXJMYXllciA9IENhbnZhc0NvbnN0YW50cy5VSV9DT0xMSVNJT05fTEFZRVI7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGxldCBzY29yZSA9IHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZS50b1N0cmluZygpLnNwbGl0KCcnKTtcblxuICAgIHNjb3JlLmZvckVhY2goKGRpZ2l0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IG9mZnNldCA9IGRpZ2l0ID09PSAnMScgPyAwLjE2IDogMDsgLy8gdGhlIDEgc3ByaXRlIGluIHRoZSBzaGVldCBpcyBhIGJpdCBvZmYgc28gbWFudWFsbHkgYWRqdXN0aW5nIGl0IHJhdGhlciB0aGFuIGFsdGVyaW5nIHRoZSBzcHJpdGUgc2hlZXRcblxuICAgICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICB0aGlzLmFzc2V0cy5pbWFnZXMuc3ByaXRlcyxcbiAgICAgICAgTlVNQkVSX1NQUklURVNfTEFSR0VbZGlnaXRdLnNwcml0ZVgsXG4gICAgICAgIE5VTUJFUl9TUFJJVEVTX0xBUkdFW2RpZ2l0XS5zcHJpdGVZLFxuICAgICAgICAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIIC8gMikgLSAoc2NvcmUubGVuZ3RoIC8gMikgKyBpbmRleCArIG9mZnNldCxcbiAgICAgICAgQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAvIDgsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgMS4xMjVcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IHR5cGUgQ2xpZW50IH0gZnJvbSAnQGNvcmUvY2xpZW50JztcbmltcG9ydCB7IFNjZW5lIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgTUFJTl9NRU5VX01BUCB9IGZyb20gJy4vbWFwcy9tYWluLW1lbnUubWFwJztcblxuZXhwb3J0IGNsYXNzIE1BSU5fTUVOVV9TQ0VORSBleHRlbmRzIFNjZW5lIHtcbiAgbWFwcyA9IFtcbiAgICBNQUlOX01FTlVfTUFQXG4gIF07XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNsaWVudDogQ2xpZW50KSB7XG4gICAgc3VwZXIoY2xpZW50KTtcbiAgICB0aGlzLmNoYW5nZU1hcCgwKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBCYWNrZ3JvdW5kTGF5ZXIgfSBmcm9tICdAY29yZS9tb2RlbC9iYWNrZ3JvdW5kLWxheWVyJztcbmltcG9ydCB7IFNjZW5lTWFwIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtbWFwJztcbmltcG9ydCB7IHR5cGUgU2NlbmVPYmplY3QgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgTUFJTl9NRU5VX0JBQ0tHUk9VTkRfTEFZRVJfMSB9IGZyb20gJy4vbWFpbi1tZW51L2JhY2tncm91bmRzL2xheWVyLjEnO1xuaW1wb3J0IHsgU3RhcnRCdXR0b25PYmplY3QgfSBmcm9tICcuL21haW4tbWVudS9vYmplY3RzL3N0YXJ0LWJ1dHRvbi5vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBNQUlOX01FTlVfU0NFTkUgfSBmcm9tICcuLi9tYWluLW1lbnUuc2NlbmUnO1xuaW1wb3J0IHsgU3ByaXRlT2JqZWN0IH0gZnJvbSAnQGNvcmUvb2JqZWN0cy9zcHJpdGUub2JqZWN0JztcblxuY29uc3QgTUFQX0hFSUdIVDogbnVtYmVyID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVDtcbmNvbnN0IE1BUF9XSURUSDogbnVtYmVyID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIO1xuXG5leHBvcnQgY2xhc3MgTUFJTl9NRU5VX01BUCBleHRlbmRzIFNjZW5lTWFwIHtcbiAgaGVpZ2h0ID0gTUFQX0hFSUdIVDtcbiAgd2lkdGggPSBNQVBfV0lEVEg7XG5cbiAgYmFja2dyb3VuZExheWVyczogQmFja2dyb3VuZExheWVyW10gPSBbXG4gICAgTUFJTl9NRU5VX0JBQ0tHUk9VTkRfTEFZRVJfMVxuICBdO1xuXG4gIG9iamVjdHM6IFNjZW5lT2JqZWN0W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IE1BSU5fTUVOVV9TQ0VORSkge1xuICAgIHN1cGVyKHNjZW5lKTtcblxuICAgIHRoaXMub2JqZWN0cy5wdXNoKG5ldyBTdGFydEJ1dHRvbk9iamVjdCh0aGlzLnNjZW5lLCB7fSkpO1xuXG4gICAgLy8gbG9nb1xuICAgIGxldCBsb2dvV2lkdGggPSA2O1xuICAgIGxldCBsb2dvSGVpZ2h0ID0gMS44O1xuICAgIHRoaXMub2JqZWN0cy5wdXNoKG5ldyBTcHJpdGVPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgcG9zaXRpb25YOiAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIIC8gMikgLSAobG9nb1dpZHRoIC8gMiksXG4gICAgICBwb3NpdGlvblk6IDMsXG4gICAgICB3aWR0aDogbG9nb1dpZHRoLFxuICAgICAgaGVpZ2h0OiBsb2dvSGVpZ2h0LFxuICAgICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgICAgc3ByaXRlWDogMjEuNzUsXG4gICAgICBzcHJpdGVZOiA1LjUsXG4gICAgfSkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyB0eXBlIEJhY2tncm91bmRMYXllciB9IGZyb20gJ0Bjb3JlL21vZGVsL2JhY2tncm91bmQtbGF5ZXInO1xuaW1wb3J0IHsgdHlwZSBCYWNrZ3JvdW5kVGlsZSB9IGZyb20gJ0Bjb3JlL21vZGVsL2JhY2tncm91bmQtdGlsZSc7XG5cbmNvbnN0IEJBU0VfVElMRTogQmFja2dyb3VuZFRpbGUgPSB7XG4gIHRpbGVzZXQ6ICdzcHJpdGVzJyxcbiAgYW5pbWF0aW9uRnJhbWVEdXJhdGlvbjogMSxcbiAgYW5pbWF0aW9uRnJhbWVzOiBbXSxcbiAgYW5pbWF0aW9uTWFwOiBbMV0sXG59O1xuXG5jb25zdCBTS1k6IEJhY2tncm91bmRUaWxlID0ge1xuICAuLi5CQVNFX1RJTEUsXG4gIGFuaW1hdGlvbkZyYW1lczogW1xuICAgIHsgc3ByaXRlWDogMCwgc3ByaXRlWTogMCwgfVxuICBdLFxufTtcblxuY29uc3QgQ0lUWV9UUkFOU0lUSU9OOiBCYWNrZ3JvdW5kVGlsZSA9IHtcbiAgLi4uQkFTRV9USUxFLFxuICBhbmltYXRpb25GcmFtZXM6IFtcbiAgICB7IHNwcml0ZVg6IDAsIHNwcml0ZVk6IDksIH1cbiAgXSxcbn07XG5cbmNvbnN0IENJVFk6IEJhY2tncm91bmRUaWxlID0ge1xuICAuLi5CQVNFX1RJTEUsXG4gIGFuaW1hdGlvbkZyYW1lczogW1xuICAgIHsgc3ByaXRlWDogMCwgc3ByaXRlWTogMTAsIH1cbiAgXSxcbn07XG5cbmNvbnN0IEdSQVNTX1RSQU5TSVRJT046IEJhY2tncm91bmRUaWxlID0ge1xuICAuLi5CQVNFX1RJTEUsXG4gIGFuaW1hdGlvbkZyYW1lczogW1xuICAgIHsgc3ByaXRlWDogMCwgc3ByaXRlWTogMTEsIH1cbiAgXSxcbn07XG5cbmNvbnN0IEdSQVNTOiBCYWNrZ3JvdW5kVGlsZSA9IHtcbiAgLi4uQkFTRV9USUxFLFxuICBhbmltYXRpb25GcmFtZXM6IFtcbiAgICB7IHNwcml0ZVg6IDAsIHNwcml0ZVk6IDE1LCB9XG4gIF0sXG59O1xuXG5jb25zdCBDT0xVTU46IEJhY2tncm91bmRUaWxlW10gPSBbXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgQ0lUWV9UUkFOU0lUSU9OLFxuICBDSVRZLFxuICBHUkFTU19UUkFOU0lUSU9OLFxuICBHUkFTUyxcbiAgR1JBU1MsXG4gIEdSQVNTXG5dO1xuXG4vLyBUT0RPKHNtZyk6IGJhY2tncm91bmQgaXMgOSB0aWxlcyB3aWRlXG5leHBvcnQgY29uc3QgTUFJTl9NRU5VX0JBQ0tHUk9VTkRfTEFZRVJfMTogQmFja2dyb3VuZExheWVyID0ge1xuICBpbmRleDogMCxcbiAgdGlsZXM6IFtcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU5cbiAgXSxcbn07XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyB0eXBlIFNjZW5lIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IE1vdXNlVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9tb3VzZS51dGlscyc7XG5pbXBvcnQgeyBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcblxufVxuXG5leHBvcnQgY2xhc3MgU3RhcnRCdXR0b25PYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBTY2VuZSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMud2lkdGggPSAzLjU7XG4gICAgdGhpcy5oZWlnaHQgPSAyO1xuICAgIHRoaXMucG9zaXRpb25YID0gKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCAvIDIpIC0gKHRoaXMud2lkdGggLyAyKTtcbiAgICB0aGlzLnBvc2l0aW9uWSA9IChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC8gMikgLSAodGhpcy5oZWlnaHQgLyAyKTtcbiAgfVxuXG4gIHVwZGF0ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gZmFsc2U7XG5cbiAgICBsZXQgY2xpY2tlZCA9IE1vdXNlVXRpbHMuaXNDbGlja1dpdGhpbih0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UucG9zaXRpb24sIHRoaXMucG9zaXRpb25YLCB0aGlzLnBvc2l0aW9uWSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIGlmICghY2xpY2tlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuY2hhbmdlU2NlbmUoR0FNRV9TQ0VORSk7XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgY29udGV4dCxcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1snc3ByaXRlcyddLFxuICAgICAgMjIsXG4gICAgICA3LjI1LFxuICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICB0aGlzLnBvc2l0aW9uWSxcbiAgICAgIHRoaXMud2lkdGgsXG4gICAgICB0aGlzLmhlaWdodFxuICAgICk7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnQGNvcmUvY2xpZW50JztcbmltcG9ydCB7IHR5cGUgQXNzZXRzQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvYXNzZXRzJztcbmltcG9ydCB7IHR5cGUgU2NlbmVDb25zdHJ1Y3RvclNpZ25hdHVyZSB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IE1BSU5fTUVOVV9TQ0VORSB9IGZyb20gJy4vc2NlbmVzL21haW4tbWVudS9tYWluLW1lbnUuc2NlbmUnO1xuaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgR0FNRV9TQ0VORSB9IGZyb20gJy4vc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBEZWZhdWx0c0NvbnN0YW50cyB9IGZyb20gJy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL2NvbnN0YW50cy9kZWZhdWx0cy5jb25zdGFudHMnO1xuXG4oZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAgKiBEZWNsYXJlIHlvdXIgY2FudmFzIGNvbnN0YW50cyBoZXJlXG4gICAqL1xuICBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUID0gMTY7XG4gIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCA9IDk7XG4gIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgPSAxNjtcblxuICAvLyBjaGVhdCBjb2Rlc1xuICBsZXQgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgbGV0IGNoZWF0Y29kZSA9IHBhcmFtcy5nZXQoJ2NoZWF0Y29kZScpO1xuICBsZXQgY2hlYXRjb2RlVmFsdWUgPSBwYXJhbXMuZ2V0KCdjaGVhdGNvZGV2YWx1ZScpO1xuICBpZiAoY2hlYXRjb2RlID09PSAnam9hbm5lJyAmJiBjaGVhdGNvZGVWYWx1ZSAhPT0gbnVsbCAmJiAhaXNOYU4oTnVtYmVyKGNoZWF0Y29kZVZhbHVlKSkpIHtcbiAgICBEZWZhdWx0c0NvbnN0YW50cy5ERUZBVUxUX1BJUEVfR0FQID0gTnVtYmVyKGNoZWF0Y29kZVZhbHVlKTtcbiAgICBjb25zb2xlLmxvZygnY2hlYXQgY29kZSBhY3RpdmF0ZWQgZm9yIHBpcGUgZ2FwOiAnICsgRGVmYXVsdHNDb25zdGFudHMuREVGQVVMVF9QSVBFX0dBUCk7XG4gIH1cblxuICAvKipcbiAgKiBBZGQgeW91ciBzY2VuZXMgaGVyZSwgdGhlIGZpcnN0IHNjZW5lIHdpbGwgYmUgbG9hZGVkIG9uIHN0YXJ0dXBcbiAgKi9cbiAgY29uc3Qgc2NlbmVzOiBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlW10gPSBbXG4gICAgTUFJTl9NRU5VX1NDRU5FLFxuICAgIEdBTUVfU0NFTkVcbiAgXTtcblxuICBjb25zdCBhc3NldHM6IEFzc2V0c0NvbmZpZyA9IHtcbiAgICBpbWFnZXM6IHtcbiAgICAgIHNwcml0ZXM6ICdhc3NldHMvc3ByaXRlcy5wbmcnLFxuICAgIH0sXG4gICAgYXVkaW86IHt9LFxuICB9O1xuXG4gIHdpbmRvdy5lbmdpbmUgPSBuZXcgQ2xpZW50KFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXItYXJlYScpLFxuICAgIHNjZW5lcyxcbiAgICBhc3NldHNcbiAgKTtcbn0pKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
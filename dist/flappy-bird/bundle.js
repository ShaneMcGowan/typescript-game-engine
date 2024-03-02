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
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
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
/**
 * For landscape devices (the only ones I am willing to suppport for now), we should calculate device aspect ratio then set CANVIS_TILE_WIDTH based off that + CANVIS_TILE_HEIGHT
 * This means "resolution" will still be low but we can fill the full monitor, we also need to set canvas.width along with this value. should be done on initialisation and also window resizing
 * Leave as hardcoded value for now
*/
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
    // 18 / 30
    CanvasConstants.CANVAS_TILE_HEIGHT = 18; // total height in tiles
    CanvasConstants.CANVAS_TILE_WIDTH = 30; // total width in tiles
    CanvasConstants.TILE_SIZE = 16; // e.g. 32 means a pixel size of tile (32px x 32px)
    CanvasConstants.OBJECT_RENDERING_LAYERS = 16; // number of layers to render objects on. e.g. for a value of 16, 0 is the lowest layer, 15 is the highest
    CanvasConstants.OBJECT_COLLISION_LAYERS = 16; // number of layers on which objects can collide. e.g. for a value of 16, 0 is the lowest layer, 15 is the highest
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
    /**
     * Used for debugging
     * @param context
     */
    SceneObject.prototype.debuggerRenderBoundary = function (context) {
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_0__.RenderUtils.strokeRectangle(context, Math.floor(this.positionX * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.positionY * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.width * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.height * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), 'red');
    };
    /**
     * Used for debugging
     * @param context
     */
    SceneObject.prototype.debuggerRenderBackground = function (context) {
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_0__.RenderUtils.fillRectangle(context, this.positionX, this.positionY, Math.floor(this.width * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), Math.floor(this.height * _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_1__.CanvasConstants.TILE_SIZE), { colour: 'red', });
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
    Object.defineProperty(SceneObject.prototype, "boundingX", {
        get: function () {
            return this.positionX + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneObject.prototype, "boundingY", {
        get: function () {
            return this.positionY + this.height;
        },
        enumerable: false,
        configurable: true
    });
    SceneObject.prototype.isCollidingWith = function (object) {
        return this.isWithinHorizontalBounds(object) && this.isWithinVerticalBounds(object);
    };
    SceneObject.prototype.isWithinHorizontalBounds = function (object) {
        if (object.positionX >= this.positionX && object.positionX <= this.boundingX) {
            return true;
        }
        if (object.boundingX >= this.positionX && object.boundingX <= this.boundingX) {
            return true;
        }
        return false;
    };
    SceneObject.prototype.isWithinVerticalBounds = function (object) {
        if (object.positionY >= this.positionY && object.positionY <= this.boundingY) {
            return true;
        }
        if (object.boundingY >= this.positionY && object.boundingY <= this.boundingY) {
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
            this.renderingContext.background[i] = this.createCanvas().getContext('2d');
            this.renderingContext.background[i].imageSmoothingEnabled = false;
        }
        for (var i = 0; i < _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_0__.CanvasConstants.OBJECT_RENDERING_LAYERS; i++) {
            this.renderingContext.objects[i] = this.createCanvas().getContext('2d');
            this.renderingContext.objects[i].imageSmoothingEnabled = false;
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
        var rotation = (_b = options.rotation) !== null && _b !== void 0 ? _b : 0; // use to rotate the output
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
                // TODO(smg): completely busted, will figure out later
                context.translate(positionX, positionY);
                context.rotate((45 * Math.PI) / 180);
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
/* harmony export */   DEFAULT_PLAYER_GRAVITY: () => (/* binding */ DEFAULT_PLAYER_GRAVITY)
/* harmony export */ });
var DEFAULT_PIPE_SPEED = 4;
var DEFAULT_PLAYER_GRAVITY = 48;
var DEFAULT_PLAYER_ACCELERATION = -12;
var DEFAULT_PIPE_GAP = 3; // gap between pipes
var DEFAULT_PIPE_REGION = 8; // only ever move within X tiles


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
                this.updateGameEnd();
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
                var gap = _constants_defaults_constants__WEBPACK_IMPORTED_MODULE_9__.DEFAULT_PIPE_GAP;
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
    };
    ControllerObject.prototype.cleanupGameEnd = function () {
        if (this.scorecard) {
            this.scene.removeObjectById(this.scorecard.id);
        }
    };
    ControllerObject.prototype.updateGameEnd = function () {
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
        _core_utils_render_utils__WEBPACK_IMPORTED_MODULE_3__.RenderUtils.renderSprite(context, this.assets.images[animation.tileset], frame.spriteX, frame.spriteY, this.positionX, this.positionY, this.width, undefined, {
            opacity: this.renderOpacity,
            scale: this.renderScale,
        });
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




(function () {
    /**
     * Declare your canvas constants here
     */
    _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_HEIGHT = 16;
    _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.CANVAS_TILE_WIDTH = 9;
    _core_constants_canvas_constants__WEBPACK_IMPORTED_MODULE_2__.CanvasConstants.TILE_SIZE = 16;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YnBhY2s6Ly8vLi4vLi4vY29yZS9jbGllbnQudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvbW9kZWwvc2NlbmUtbWFwLnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL21vZGVsL3NjZW5lLW9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS9tb2RlbC9zY2VuZS50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS9tb2RlbC9zcHJpdGUtYW5pbWF0aW9uLnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL29iamVjdHMvaW50ZXJ2YWwub2JqZWN0LnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL29iamVjdHMvc3ByaXRlLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS91dGlscy9tYXRoLnV0aWxzLnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL3V0aWxzL21vdXNlLnV0aWxzLnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL3V0aWxzL3JlbmRlci51dGlscy50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS5tYXAudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL2NvbnN0YW50cy9kZWZhdWx0cy5jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL2NvbnN0YW50cy9ldmVudHMuY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9jb25zdGFudHMvbWVkYWwuY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9jb25zdGFudHMvc3ByaXRlLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvb2JqZWN0cy9jb250cm9sbGVyLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvb2JqZWN0cy9mbG9vci5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL29iamVjdHMvcGlwZS5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL29iamVjdHMvcGxheWVyLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvb2JqZWN0cy9wb2ludC5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL29iamVjdHMvc2NvcmUtY2FyZC5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL29iamVjdHMvc2NvcmUub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9tYWluLW1lbnUvbWFpbi1tZW51LnNjZW5lLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9tYWluLW1lbnUvbWFwcy9tYWluLW1lbnUubWFwLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9tYWluLW1lbnUvbWFwcy9tYWluLW1lbnUvYmFja2dyb3VuZHMvbGF5ZXIuMS50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvbWFpbi1tZW51L21hcHMvbWFpbi1tZW51L29iamVjdHMvc3RhcnQtYnV0dG9uLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICcuL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgU2NlbmVDb25zdHJ1Y3RvclNpZ25hdHVyZSwgdHlwZSBTY2VuZSB9IGZyb20gJy4vbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICcuL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyB0eXBlIEFzc2V0c0NvbmZpZywgdHlwZSBBc3NldHMgfSBmcm9tICcuL21vZGVsL2Fzc2V0cyc7XG5cbmV4cG9ydCBjbGFzcyBDbGllbnQge1xuICAvLyBDb25zdGFudHNcbiAgcHJpdmF0ZSByZWFkb25seSBDQU5WQVNfSEVJR0hUOiBudW1iZXIgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX0hFSUdIVDtcbiAgcHJpdmF0ZSByZWFkb25seSBDQU5WQVNfV0lEVEg6IG51bWJlciA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfV0lEVEg7XG5cbiAgLy8gVUlcbiAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIHB1YmxpYyBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHB1YmxpYyBkZWx0YTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBsYXN0UmVuZGVyVGltZXN0YW1wOiBudW1iZXIgPSAwO1xuXG4gIC8vIERhdGFcbiAgcHJpdmF0ZSByZWFkb25seSBzY2VuZXM6IFNjZW5lQ29uc3RydWN0b3JTaWduYXR1cmVbXTtcbiAgcHJpdmF0ZSBjdXJyZW50U2NlbmU6IFNjZW5lO1xuXG4gIC8vIEFzc2V0c1xuICBhc3NldHM6IEFzc2V0cyA9IHtcbiAgICBpbWFnZXM6IHt9LFxuICAgIGF1ZGlvOiB7fSxcbiAgfTtcblxuICAvLyBEZWJ1Z1xuICBkZWJ1ZyA9IHtcbiAgICBlbmFibGVkOiB0cnVlLCAvLyBpZiB0cnVlLCBkZWJ1ZyBrZXlzIGFyZSBlbmFibGVkXG4gICAgc3RhdHM6IHtcbiAgICAgIGZwczogZmFsc2UsIC8vIHNob3cgZnBzXG4gICAgICBmcHNDb3VudGVyOiAwLCAvLyB0aW1lIHNpbmNlIGxhc3QgY2hlY2tcbiAgICAgIG9iamVjdENvdW50OiBmYWxzZSwgLy8gc2hvdyBvYmplY3QgY291bnRcbiAgICB9LFxuICAgIGJyZWFrcG9pbnQ6IHtcbiAgICAgIGZyYW1lOiBmYWxzZSxcbiAgICB9LFxuICAgIHRpbWluZzoge1xuICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgZnJhbWVCYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICAgIGZyYW1lVXBkYXRlOiBmYWxzZSxcbiAgICAgIGZyYW1lUmVuZGVyOiBmYWxzZSxcbiAgICB9LFxuICAgIHVpOiB7XG4gICAgICBncmlkOiB7XG4gICAgICAgIGxpbmVzOiBmYWxzZSxcbiAgICAgICAgbnVtYmVyczogZmFsc2UsXG4gICAgICB9LFxuICAgICAgY2FudmFzTGF5ZXJzOiBmYWxzZSxcbiAgICB9LFxuICAgIG9iamVjdDoge1xuICAgICAgcmVuZGVyQm91bmRhcnk6IGZhbHNlLFxuICAgICAgcmVuZGVyQmFja2dyb3VuZDogZmFsc2UsXG4gICAgfSxcbiAgfTtcblxuICAvLyBjb250cm9sbGVyc1xuICBnYW1lcGFkOiBHYW1lcGFkIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb250YWluZXI6IEhUTUxFbGVtZW50LFxuICAgIHNjZW5lczogU2NlbmVDb25zdHJ1Y3RvclNpZ25hdHVyZVtdLFxuICAgIGFzc2V0czogQXNzZXRzQ29uZmlnXG4gICkge1xuICAgIC8vIHNjZW5lc1xuICAgIHRoaXMuc2NlbmVzID0gWy4uLnNjZW5lc107XG5cbiAgICAvLyBsb2FkIGFzc2V0c1xuICAgIC8vIFRPRE8oc21nKTogc29tZSBzb3J0IG9mIGxvYWRpbmcgc2NyZWVuIC8gcmVuZGVyaW5nIGRlbGF5IHVudGlsIGFzc2V0cyBhcmUgbG9hZGVkXG4gICAgT2JqZWN0LmtleXMoYXNzZXRzLmltYWdlcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNba2V5XSA9IG5ldyBJbWFnZSgpO1xuICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzW2tleV0uc3JjID0gYXNzZXRzLmltYWdlc1trZXldO1xuICAgIH0pO1xuICAgIE9iamVjdC5rZXlzKGFzc2V0cy5hdWRpbykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLmFzc2V0cy5hdWRpb1trZXldID0gbmV3IEF1ZGlvKGFzc2V0cy5hdWRpb1trZXldKTtcbiAgICB9KTtcblxuICAgIC8vIGluaXRpYWxpc2UgZGVidWcgY29udHJvbHNcbiAgICBpZiAodGhpcy5kZWJ1Zy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmluaXRpYWxpc2VEZWJ1Z2dlckxpc3RlbmVycygpO1xuICAgIH1cblxuICAgIC8vIGluaXRpYWxpc2UgY2FudmFzXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcygpO1xuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgLy8gYXR0YWNoIGNhbnZhcyB0byB1aVxuICAgIGNvbnRhaW5lci5hcHBlbmQodGhpcy5jYW52YXMpO1xuXG4gICAgLy8gZ28gZnVsbHNjcmVlblxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgLy8gdGhpcy5jYW52YXMucmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICB9KTtcblxuICAgIC8vIGhhbmRsZSB0YWJiZWQgb3V0IHN0YXRlXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIC8vIFRPRE8oc21nKTogcGF1c2UgZnJhbWUgZXhlY3V0aW9uXG4gICAgICAgIGNvbnNvbGUubG9nKCd0YWIgaXMgYWN0aXZlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPKHNtZyk6IGNvbnRpbnVlIGZyYW1lIGV4ZWN1dGlvblxuICAgICAgICBjb25zb2xlLmxvZygndGFiIGlzIGluYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBpbml0aWFsaXNlIGdhbWVwYWQgbGlzdGVuZXJzXG4gICAgdGhpcy5pbnRpYWxpc2VHYW1lcGFkTGlzdGVuZXJzKCk7XG5cbiAgICAvLyBsb2FkIGZpcnN0IHNjZW5lXG4gICAgdGhpcy5jaGFuZ2VTY2VuZSh0aGlzLnNjZW5lc1swXSk7XG5cbiAgICAvLyBSdW4gZ2FtZSBsb2dpY1xuICAgIHRoaXMuZnJhbWUoMCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNhbnZhcygpOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgLy8gY3JlYXRlIGNhbnZhc1xuICAgIGNvbnN0IGNhbnZhcyA9IFJlbmRlclV0aWxzLmNyZWF0ZUNhbnZhcygpO1xuXG4gICAgLy8gcHJldmVudCByaWdodCBjbGljayBtZW51XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIC8vIFRPRE8oc21nKTogbmVlZCBzb21lIHNvcnQgb2Ygc2NlbmUgY2xhc3MgbGlzdCB0eXBlXG4gIGNoYW5nZVNjZW5lKHNjZW5lQ2xhc3M6IFNjZW5lQ29uc3RydWN0b3JTaWduYXR1cmUpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IFJlZmxlY3QuY29uc3RydWN0KHNjZW5lQ2xhc3MsIFt0aGlzXSk7XG4gIH1cblxuICAvKipcbiAgICogT25lIGZyYW1lIG9mIGdhbWUgbG9naWNcbiAgICogQHBhcmFtIHRpbWVzdGFtcFxuICAgKi9cbiAgcHJpdmF0ZSBmcmFtZSh0aW1lc3RhbXA6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmRlYnVnLmJyZWFrcG9pbnQuZnJhbWUpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnLnRpbWluZy5mcmFtZSkge1xuICAgICAgY29uc29sZS5sb2coYFtmcmFtZV0gJHt0aGlzLmRlbHRhfWApO1xuICAgIH1cblxuICAgIC8vIFNldCBEZWxhdGFcbiAgICB0aGlzLnNldERlbHRhKHRpbWVzdGFtcCk7XG5cbiAgICAvLyBDbGVhciBjYW52YXMgYmVmb3JlIHJlbmRlclxuICAgIFJlbmRlclV0aWxzLmNsZWFyQ2FudmFzKHRoaXMuY29udGV4dCk7XG5cbiAgICAvLyBydW4gZnJhbWUgbG9naWNcbiAgICB0aGlzLmN1cnJlbnRTY2VuZS5mcmFtZSh0aGlzLmRlbHRhKTtcblxuICAgIC8vIFJlbmRlciBzdGF0c1xuICAgIGlmICh0aGlzLmRlYnVnLnN0YXRzLmZwcykge1xuICAgICAgaWYgKHRoaXMuZGVidWcuc3RhdHMuZnBzQ291bnRlcikge1xuICAgICAgICB0aGlzLnJlbmRlclN0YXRzKDAsICdGUFMnLCBgJHtNYXRoLnJvdW5kKDEwMDAgLyAoKHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy5kZWJ1Zy5zdGF0cy5mcHNDb3VudGVyKSkpfSBGUFNgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGVidWcuc3RhdHMuZnBzQ291bnRlciA9IHRpbWVzdGFtcDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGVidWcuc3RhdHMub2JqZWN0Q291bnQpIHtcbiAgICAgIHRoaXMucmVuZGVyU3RhdHMoMSwgJ09iamVjdHMnLCBgJHt0aGlzLmN1cnJlbnRTY2VuZS5vYmplY3RzLmxlbmd0aH0gb2JqZWN0c2ApO1xuICAgIH1cblxuICAgIC8vIGRlYnVnIGdyaWRcbiAgICB0aGlzLnJlbmRlckdyaWQoKTtcblxuICAgIC8vIGNoZWNrIGZvciBtYXAgY2hhbmdlXG4gICAgaWYgKHRoaXMuY3VycmVudFNjZW5lLmZsYWdnZWRGb3JNYXBDaGFuZ2UpIHtcbiAgICAgIHRoaXMuY3VycmVudFNjZW5lLmNoYW5nZU1hcCh0aGlzLmN1cnJlbnRTY2VuZS5mbGFnZ2VkRm9yTWFwQ2hhbmdlKTtcbiAgICB9XG5cbiAgICAvLyBDYWxsIG5leHQgZnJhbWVcbiAgICAvLyAod2Ugc2V0IGB0aGlzYCBjb250ZXh0IGZvciB3aGVuIHVzaW5nIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmZyYW1lLmJpbmQodGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgdGltZSBzaW5jZSB0aGUgcHJldmlvdXMgZnJhbWVcbiAgICogQHBhcmFtIHRpbWVzdGFtcFxuICAgKi9cbiAgcHJpdmF0ZSBzZXREZWx0YSh0aW1lc3RhbXA6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuZGVsdGEgPSAodGltZXN0YW1wIC0gdGhpcy5sYXN0UmVuZGVyVGltZXN0YW1wKSAvIDEwMDA7XG4gICAgdGhpcy5sYXN0UmVuZGVyVGltZXN0YW1wID0gdGltZXN0YW1wO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTdGF0cyhpbmRleDogbnVtYmVyLCBsYWJlbDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICdyZWQnO1xuICAgIHRoaXMuY29udGV4dC5mb250ID0gJzEycHggc2VyaWYnO1xuICAgIHRoaXMuY29udGV4dC5maWxsVGV4dCh2YWx1ZSwgdGhpcy5DQU5WQVNfV0lEVEggLSA1MCwgKGluZGV4ICsgMSkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyR3JpZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWJ1Zy51aS5ncmlkLmxpbmVzIHx8IHRoaXMuZGVidWcudWkuZ3JpZC5udW1iZXJzKSB7XG4gICAgICBSZW5kZXJVdGlscy5maWxsUmVjdGFuZ2xlKHRoaXMuY29udGV4dCwgMCwgMCwgdGhpcy5DQU5WQVNfV0lEVEgsIHRoaXMuQ0FOVkFTX0hFSUdIVCwgeyBjb2xvdXI6ICdyZ2JhKDAsIDAsIDAsIDAuMjUpJywgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWcudWkuZ3JpZC5saW5lcykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLkNBTlZBU19XSURUSDsgeCArPSBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSB7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5DQU5WQVNfSEVJR0hUOyB5ICs9IENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpIHtcbiAgICAgICAgICBSZW5kZXJVdGlscy5zdHJva2VSZWN0YW5nbGUodGhpcy5jb250ZXh0LCB4LCB5LCBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFLCBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFLCAnYmxhY2snKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnLnVpLmdyaWQubnVtYmVycykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEg7IHgrKykge1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQ7IHkrKykge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gJzhweCBoZWx2ZXRpY2EnO1xuICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChgJHt4fWAsICh4ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyAxLCAoeSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpICsgOCk7IC8vIDggaXMgOCBweFxuICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChgJHt5fWAsICh4ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyA2LCAoeSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpICsgMTQpOyAvLyAxNiBpcyAxNnB4XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpc2VEZWJ1Z2dlckxpc3RlbmVycygpOiB2b2lkIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xuICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgY2FzZSAnMSc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy51aS5ncmlkLmxpbmVzID0gIXRoaXMuZGVidWcudWkuZ3JpZC5saW5lcztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnMic6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy51aS5ncmlkLm51bWJlcnMgPSAhdGhpcy5kZWJ1Zy51aS5ncmlkLm51bWJlcnM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzMnOlxuICAgICAgICAgIHRoaXMuZGVidWcuYnJlYWtwb2ludC5mcmFtZSA9ICF0aGlzLmRlYnVnLmJyZWFrcG9pbnQuZnJhbWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzQnOlxuICAgICAgICAgIHRoaXMuZGVidWcuc3RhdHMuZnBzID0gIXRoaXMuZGVidWcuc3RhdHMuZnBzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc1JzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnN0YXRzLm9iamVjdENvdW50ID0gIXRoaXMuZGVidWcuc3RhdHMub2JqZWN0Q291bnQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzYnOlxuICAgICAgICAgIHRoaXMuZGVidWcudGltaW5nLmZyYW1lID0gIXRoaXMuZGVidWcudGltaW5nLmZyYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc3JzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnRpbWluZy5mcmFtZUJhY2tncm91bmQgPSAhdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWVCYWNrZ3JvdW5kO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc4JzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnRpbWluZy5mcmFtZVJlbmRlciA9ICF0aGlzLmRlYnVnLnRpbWluZy5mcmFtZVJlbmRlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnOSc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWVVcGRhdGUgPSAhdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWVVcGRhdGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzAnOlxuICAgICAgICAgIHRoaXMuZGVidWcudWkuY2FudmFzTGF5ZXJzID0gIXRoaXMuZGVidWcudWkuY2FudmFzTGF5ZXJzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAvLyBub3RoaW5nIHlldFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAvLyBub3RoaW5nIHlldFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnRpYWxpc2VHYW1lcGFkTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdnYW1lcGFkY29ubmVjdGVkJywgKGV2ZW50OiBHYW1lcGFkRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnR2FtZXBhZCBjb25uZWN0ZWQgYXQgaW5kZXggJWQ6ICVzLiAlZCBidXR0b25zLCAlZCBheGVzLicsXG4gICAgICAgIGV2ZW50LmdhbWVwYWQuaW5kZXgsXG4gICAgICAgIGV2ZW50LmdhbWVwYWQuaWQsXG4gICAgICAgIGV2ZW50LmdhbWVwYWQuYnV0dG9ucy5sZW5ndGgsXG4gICAgICAgIGV2ZW50LmdhbWVwYWQuYXhlcy5sZW5ndGhcbiAgICAgICk7XG4gICAgICB0aGlzLmdhbWVwYWQgPSBldmVudC5nYW1lcGFkO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdnYW1lcGFkZGlzY29ubmVjdGVkJywgKGV2ZW50OiBHYW1lcGFkRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuZ2FtZXBhZCA9IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBGb3IgbGFuZHNjYXBlIGRldmljZXMgKHRoZSBvbmx5IG9uZXMgSSBhbSB3aWxsaW5nIHRvIHN1cHBwb3J0IGZvciBub3cpLCB3ZSBzaG91bGQgY2FsY3VsYXRlIGRldmljZSBhc3BlY3QgcmF0aW8gdGhlbiBzZXQgQ0FOVklTX1RJTEVfV0lEVEggYmFzZWQgb2ZmIHRoYXQgKyBDQU5WSVNfVElMRV9IRUlHSFRcbiAqIFRoaXMgbWVhbnMgXCJyZXNvbHV0aW9uXCIgd2lsbCBzdGlsbCBiZSBsb3cgYnV0IHdlIGNhbiBmaWxsIHRoZSBmdWxsIG1vbml0b3IsIHdlIGFsc28gbmVlZCB0byBzZXQgY2FudmFzLndpZHRoIGFsb25nIHdpdGggdGhpcyB2YWx1ZS4gc2hvdWxkIGJlIGRvbmUgb24gaW5pdGlhbGlzYXRpb24gYW5kIGFsc28gd2luZG93IHJlc2l6aW5nXG4gKiBMZWF2ZSBhcyBoYXJkY29kZWQgdmFsdWUgZm9yIG5vd1xuKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDYW52YXNDb25zdGFudHMge1xuICAvLyAxOCAvIDMwXG4gIHN0YXRpYyBDQU5WQVNfVElMRV9IRUlHSFQgPSAxODsgLy8gdG90YWwgaGVpZ2h0IGluIHRpbGVzXG4gIHN0YXRpYyBDQU5WQVNfVElMRV9XSURUSCA9IDMwOyAvLyB0b3RhbCB3aWR0aCBpbiB0aWxlc1xuICBzdGF0aWMgVElMRV9TSVpFOiBudW1iZXIgPSAxNjsgLy8gZS5nLiAzMiBtZWFucyBhIHBpeGVsIHNpemUgb2YgdGlsZSAoMzJweCB4IDMycHgpXG4gIHN0YXRpYyBPQkpFQ1RfUkVOREVSSU5HX0xBWUVSUzogbnVtYmVyID0gMTY7IC8vIG51bWJlciBvZiBsYXllcnMgdG8gcmVuZGVyIG9iamVjdHMgb24uIGUuZy4gZm9yIGEgdmFsdWUgb2YgMTYsIDAgaXMgdGhlIGxvd2VzdCBsYXllciwgMTUgaXMgdGhlIGhpZ2hlc3RcbiAgc3RhdGljIE9CSkVDVF9DT0xMSVNJT05fTEFZRVJTOiBudW1iZXIgPSAxNjsgLy8gbnVtYmVyIG9mIGxheWVycyBvbiB3aGljaCBvYmplY3RzIGNhbiBjb2xsaWRlLiBlLmcuIGZvciBhIHZhbHVlIG9mIDE2LCAwIGlzIHRoZSBsb3dlc3QgbGF5ZXIsIDE1IGlzIHRoZSBoaWdoZXN0XG5cbiAgLyoqXG4gICAqIEtlZXAgYW4gZXllIG9uIHRoaXMgYW5kIGFueSBnZXR0ZXJzLCBkb24ndCBydW4gaXQgb24gaG90IGNvZGUgcGF0aHNcbiAgICovXG4gIHN0YXRpYyBnZXQgQ0FOVkFTX0hFSUdIVCgpOiBudW1iZXIge1xuICAgIHJldHVybiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFICogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVDtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgQ0FOVkFTX1dJRFRIKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgKiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEg7XG4gIH1cblxuICBzdGF0aWMgZ2V0IEFTUEVDVF9SQVRJTygpOiBudW1iZXIge1xuICAgIHJldHVybiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC8gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXllciB0aGF0IFVJIGVsZW1lbnRzIHNob3VsZCBiZSByZW5kZXJlZCBvblxuICAgKi9cbiAgc3RhdGljIGdldCBVSV9SRU5ERVJfTEFZRVIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLk9CSkVDVF9SRU5ERVJJTkdfTEFZRVJTIC0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY29sbGlzaW9uIGxheWVyIGZvciBVSSBlbGVtZW50cyBzbyB0aGF0IGdhbWUgZWxlbWVudHMgZG9uJ3QgaW50ZXJhY3Qgd2l0aCB0aGVtXG4gICAqL1xuICBzdGF0aWMgZ2V0IFVJX0NPTExJU0lPTl9MQVlFUigpOiBudW1iZXIge1xuICAgIHJldHVybiBDYW52YXNDb25zdGFudHMuT0JKRUNUX0NPTExJU0lPTl9MQVlFUlMgLSAxO1xuICB9XG5cbiAgc3RhdGljIGdldCBDQU5WQVNfQ0VOVEVSX1RJTEVfWSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLkNBTlZBU19USUxFX0hFSUdIVCAvIDI7XG4gIH1cblxuICBzdGF0aWMgZ2V0IENBTlZBU19DRU5URVJfVElMRV9YKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuQ0FOVkFTX1RJTEVfV0lEVEggLyAyO1xuICB9XG5cbiAgc3RhdGljIGdldCBDQU5WQVNfQ0VOVEVSX1BJWEVMX1goKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19XSURUSCAvIDI7XG4gIH1cblxuICBzdGF0aWMgZ2V0IENBTlZBU19DRU5URVJfUElYRUxfWSgpOiBudW1iZXIge1xuICAgIHJldHVybiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX0hFSUdIVCAvIDI7XG4gIH1cbn1cbiIsImltcG9ydCB7IHR5cGUgQXNzZXRzIH0gZnJvbSAnLi9hc3NldHMnO1xuaW1wb3J0IHsgdHlwZSBCYWNrZ3JvdW5kTGF5ZXIgfSBmcm9tICcuL2JhY2tncm91bmQtbGF5ZXInO1xuaW1wb3J0IHsgdHlwZSBTY2VuZSB9IGZyb20gJy4vc2NlbmUnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZU9iamVjdCB9IGZyb20gJy4vc2NlbmUtb2JqZWN0JztcblxuZXhwb3J0IHR5cGUgU2NlbmVNYXBDb25zdHJ1Y3RvclNpZ25hdHVyZSA9IG5ldyAoY2xpZW50OiBTY2VuZSkgPT4gU2NlbmVNYXA7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTY2VuZU1hcCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBiYWNrZ3JvdW5kTGF5ZXJzOiBCYWNrZ3JvdW5kTGF5ZXJbXTtcbiAgb2JqZWN0czogU2NlbmVPYmplY3RbXTtcbiAgZ2xvYmFsczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXG4gIHByb3RlY3RlZCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByb3RlY3RlZCBhc3NldHM6IEFzc2V0cztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgc2NlbmU6IFNjZW5lXG4gICkge1xuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuc2NlbmUuY29udGV4dDtcbiAgICB0aGlzLmFzc2V0cyA9IHRoaXMuc2NlbmUuYXNzZXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBtYXAgaXMgZGVzdHJveWVkXG4gICAqL1xuICBkZXN0cm95PygpOiB2b2lkIHtcbiAgICAvLyBkbyBub3RoaW5nIGJ5IGRlZmF1bHRcbiAgfVxufVxuIiwiaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZSB9IGZyb20gJy4vc2NlbmUnO1xuaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBBc3NldHMgfSBmcm9tICcuL2Fzc2V0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcbiAgcG9zaXRpb25YPzogbnVtYmVyO1xuICBwb3NpdGlvblk/OiBudW1iZXI7XG4gIHRhcmdldFg/OiBudW1iZXI7XG4gIHRhcmdldFk/OiBudW1iZXI7XG5cbiAgaXNSZW5kZXJhYmxlPzogYm9vbGVhbjtcbiAgcmVuZGVyTGF5ZXI/OiBudW1iZXI7XG4gIHJlbmRlck9wYWNpdHk/OiBudW1iZXI7XG4gIHJlbmRlclNjYWxlPzogbnVtYmVyO1xuXG4gIGhhc0NvbGxpc2lvbj86IGJvb2xlYW47XG4gIGNvbGxpc2lvbkxheWVyPzogbnVtYmVyO1xufVxuXG5jb25zdCBERUZBVUxUX0lTX1JFTkRFUkFCTEU6IGJvb2xlYW4gPSBmYWxzZTtcbmNvbnN0IERFRkFVTFRfUkVOREVSX0xBWUVSOiBudW1iZXIgPSAwO1xuY29uc3QgREVGQVVMVF9SRU5ERVJfT1BBQ0lUWTogbnVtYmVyID0gMTtcbmNvbnN0IERFRkFVTFRfUkVOREVSX1NDQUxFOiBudW1iZXIgPSAxO1xuXG5jb25zdCBERUZBVUxUX0hBU19DT0xMSVNJT046IGJvb2xlYW4gPSBmYWxzZTtcbmNvbnN0IERFRkFVTFRfQ09MTElTSU9OX0xBWUVSOiBudW1iZXIgPSAwO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2NlbmVPYmplY3Qge1xuICBpZDogc3RyaW5nID0gY3J5cHRvLnJhbmRvbVVVSUQoKTtcblxuICAvLyBwb3NpdGlvblxuICBwb3NpdGlvblg6IG51bWJlciA9IC0xO1xuICBwb3NpdGlvblk6IG51bWJlciA9IC0xO1xuICB0YXJnZXRYOiBudW1iZXIgPSAtMTtcbiAgdGFyZ2V0WTogbnVtYmVyID0gLTE7XG5cbiAgLy8gZGltZW5zaW9uc1xuICB3aWR0aDogbnVtYmVyID0gMTtcbiAgaGVpZ2h0OiBudW1iZXIgPSAxO1xuXG4gIC8vIGNvbGxpc2lvblxuICBoYXNDb2xsaXNpb246IGJvb2xlYW47XG4gIGNvbGxpc2lvbkxheWVyOiBudW1iZXI7XG5cbiAgLy8gcmVuZGVyaW5nXG4gIGlzUmVuZGVyYWJsZTogYm9vbGVhbjtcbiAgcmVuZGVyTGF5ZXI6IG51bWJlcjtcbiAgcmVuZGVyT3BhY2l0eTogbnVtYmVyOyAvLyB0aGUgb3BhY2l0eSBvZiB0aGUgb2JqZWN0IHdoZW4gcmVuZGVyZWQgKHZhbHVlIGJldHdlZW4gMCBhbmQgMSlcbiAgcmVuZGVyU2NhbGU6IG51bWJlcjsgLy8gdGhlIHNjYWxlIG9mIHRoZSBvYmplY3Qgd2hlbiByZW5kZXJlZFxuXG4gIC8vIFRPRE8oc21nKTogSSdtIG5vdCBjb252aW5jZWQgb2YgdGhpcyBidXQgSSB3aWxsIGdvIHdpdGggaXQgZm9yIG5vd1xuICBrZXlMaXN0ZW5lcnM6IFJlY29yZDxzdHJpbmcsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD4gPSB7fTsgLy8gZm9yIGtleWJvYXJkIGV2ZW50c1xuICBldmVudExpc3RlbmVyczogUmVjb3JkPHN0cmluZywgKGV2ZW50OiBDdXN0b21FdmVudCkgPT4gdm9pZD4gPSB7fTsgLy8gZm9yIHNjZW5lIGV2ZW50c1xuXG4gIHByb3RlY3RlZCBtYWluQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcm90ZWN0ZWQgYXNzZXRzOiBBc3NldHM7XG5cbiAgLy8gZmxhZ3NcbiAgZmxhZ2dlZEZvclJlbmRlcjogYm9vbGVhbiA9IHRydWU7IC8vIFRPRE8oc21nKTogaW1wbGVtZW50IHRoZSB1c2FnZSBvZiB0aGlzIGZsYWcgdG8gaW1wcm92ZSBlbmdpbmUgcGVyZm9ybWFuY2VcbiAgZmxhZ2dlZEZvclVwZGF0ZTogYm9vbGVhbiA9IHRydWU7IC8vIFRPRE8oc21nKTogaW1wbGVtZW50IHRoZSB1c2FnZSBvZiB0aGlzIGZsYWcgdG8gaW1wcm92ZSBlbmdpbmUgcGVyZm9ybWFuY2VcbiAgZmxhZ2dlZEZvckRlc3Ryb3k6IGJvb2xlYW4gPSBmYWxzZTsgLy8gVE9ETyhzbWcpOiBpbXBsZW1lbnQgdGhpcy4gdXNlZCB0byByZW1vdmUgb2JqZWN0IGZyb20gc2NlbmUgb24gbmV4dCB1cGRhdGUgcmF0aGVyIHRoYW4gbWlkIHVwZGF0ZSBldGNcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgc2NlbmU6IFNjZW5lLFxuICAgIGNvbmZpZzogU2NlbmVPYmplY3RCYXNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMubWFpbkNvbnRleHQgPSB0aGlzLnNjZW5lLmNvbnRleHQ7XG4gICAgdGhpcy5hc3NldHMgPSB0aGlzLnNjZW5lLmFzc2V0cztcblxuICAgIC8vIHBvc2l0aW9uIGRlZmF1bHRcbiAgICBpZiAoY29uZmlnLnBvc2l0aW9uWCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uWCA9IGNvbmZpZy5wb3NpdGlvblg7XG4gICAgICBpZiAoY29uZmlnLnRhcmdldFggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRhcmdldFggPSB0aGlzLnBvc2l0aW9uWDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnBvc2l0aW9uWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uWSA9IGNvbmZpZy5wb3NpdGlvblk7XG4gICAgICBpZiAoY29uZmlnLnRhcmdldFkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRhcmdldFkgPSB0aGlzLnBvc2l0aW9uWTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnRhcmdldFggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50YXJnZXRYID0gY29uZmlnLnRhcmdldFg7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy50YXJnZXRZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGFyZ2V0WSA9IGNvbmZpZy50YXJnZXRZO1xuICAgIH1cblxuICAgIHRoaXMuaXNSZW5kZXJhYmxlID0gY29uZmlnLmlzUmVuZGVyYWJsZSA/PyBERUZBVUxUX0lTX1JFTkRFUkFCTEU7XG4gICAgdGhpcy5yZW5kZXJMYXllciA9IGNvbmZpZy5yZW5kZXJMYXllciA/PyBERUZBVUxUX1JFTkRFUl9MQVlFUjtcbiAgICB0aGlzLnJlbmRlck9wYWNpdHkgPSBjb25maWcucmVuZGVyT3BhY2l0eSA/PyBERUZBVUxUX1JFTkRFUl9PUEFDSVRZO1xuXG4gICAgdGhpcy5oYXNDb2xsaXNpb24gPSBjb25maWcuaGFzQ29sbGlzaW9uID8/IERFRkFVTFRfSEFTX0NPTExJU0lPTjtcbiAgICB0aGlzLmNvbGxpc2lvbkxheWVyID0gY29uZmlnLmNvbGxpc2lvbkxheWVyID8/IERFRkFVTFRfQ09MTElTSU9OX0xBWUVSO1xuICAgIHRoaXMucmVuZGVyU2NhbGUgPSBjb25maWcucmVuZGVyU2NhbGUgPz8gREVGQVVMVF9SRU5ERVJfU0NBTEU7XG4gIH1cblxuICB1cGRhdGU/KGRlbHRhOiBudW1iZXIpOiB2b2lkO1xuICByZW5kZXI/KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQ7XG4gIGRlc3Ryb3k/KCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFVzZWQgZm9yIGRlYnVnZ2luZ1xuICAgKiBAcGFyYW0gY29udGV4dFxuICAgKi9cbiAgZGVidWdnZXJSZW5kZXJCb3VuZGFyeShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBSZW5kZXJVdGlscy5zdHJva2VSZWN0YW5nbGUoXG4gICAgICBjb250ZXh0LFxuICAgICAgTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9uWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9uWSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLndpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksXG4gICAgICBNYXRoLmZsb29yKHRoaXMuaGVpZ2h0ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksXG4gICAgICAncmVkJ1xuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBmb3IgZGVidWdnaW5nXG4gICAqIEBwYXJhbSBjb250ZXh0XG4gICAqL1xuICBkZWJ1Z2dlclJlbmRlckJhY2tncm91bmQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgUmVuZGVyVXRpbHMuZmlsbFJlY3RhbmdsZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgIHRoaXMucG9zaXRpb25ZLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLndpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksXG4gICAgICBNYXRoLmZsb29yKHRoaXMuaGVpZ2h0ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksXG4gICAgICB7IGNvbG91cjogJ3JlZCcsIH1cbiAgICApO1xuICB9XG5cbiAgZ2V0IGNhbWVyYVJlbGF0aXZlUG9zaXRpb25YKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25YICsgdGhpcy5zY2VuZS5nbG9iYWxzLmNhbWVyYS5zdGFydFg7XG4gIH1cblxuICBnZXQgY2FtZXJhUmVsYXRpdmVQb3NpdGlvblkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvblkgKyB0aGlzLnNjZW5lLmdsb2JhbHMuY2FtZXJhLnN0YXJ0WTtcbiAgfVxuXG4gIGdldCBwaXhlbFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFO1xuICB9XG5cbiAgZ2V0IHBpeGVsSGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgfVxuXG4gIGdldCBib3VuZGluZ1goKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvblggKyB0aGlzLndpZHRoO1xuICB9XG5cbiAgZ2V0IGJvdW5kaW5nWSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uWSArIHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgaXNDb2xsaWRpbmdXaXRoKG9iamVjdDogU2NlbmVPYmplY3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1dpdGhpbkhvcml6b250YWxCb3VuZHMob2JqZWN0KSAmJiB0aGlzLmlzV2l0aGluVmVydGljYWxCb3VuZHMob2JqZWN0KTtcbiAgfVxuXG4gIGlzV2l0aGluSG9yaXpvbnRhbEJvdW5kcyhvYmplY3Q6IFNjZW5lT2JqZWN0KTogYm9vbGVhbiB7XG4gICAgaWYgKG9iamVjdC5wb3NpdGlvblggPj0gdGhpcy5wb3NpdGlvblggJiYgb2JqZWN0LnBvc2l0aW9uWCA8PSB0aGlzLmJvdW5kaW5nWCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKG9iamVjdC5ib3VuZGluZ1ggPj0gdGhpcy5wb3NpdGlvblggJiYgb2JqZWN0LmJvdW5kaW5nWCA8PSB0aGlzLmJvdW5kaW5nWCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNXaXRoaW5WZXJ0aWNhbEJvdW5kcyhvYmplY3Q6IFNjZW5lT2JqZWN0KTogYm9vbGVhbiB7XG4gICAgaWYgKG9iamVjdC5wb3NpdGlvblkgPj0gdGhpcy5wb3NpdGlvblkgJiYgb2JqZWN0LnBvc2l0aW9uWSA8PSB0aGlzLmJvdW5kaW5nWSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKG9iamVjdC5ib3VuZGluZ1kgPj0gdGhpcy5wb3NpdGlvblkgJiYgb2JqZWN0LmJvdW5kaW5nWSA8PSB0aGlzLmJvdW5kaW5nWSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyB0eXBlIEJhY2tncm91bmRMYXllciB9IGZyb20gJy4vYmFja2dyb3VuZC1sYXllcic7XG5pbXBvcnQgeyB0eXBlIFNjZW5lTWFwQ29uc3RydWN0b3JTaWduYXR1cmUsIHR5cGUgU2NlbmVNYXAgfSBmcm9tICcuL3NjZW5lLW1hcCc7XG5pbXBvcnQgeyB0eXBlIFNjZW5lT2JqZWN0IH0gZnJvbSAnLi9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgTW91c2VVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL21vdXNlLnV0aWxzJztcbmltcG9ydCB7IHR5cGUgQ2xpZW50IH0gZnJvbSAnQGNvcmUvY2xpZW50JztcbmltcG9ydCB7IHR5cGUgQXNzZXRzIH0gZnJvbSAnLi9hc3NldHMnO1xuXG5leHBvcnQgdHlwZSBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlID0gbmV3IChjbGllbnQ6IENsaWVudCkgPT4gU2NlbmU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NlbmVSZW5kZXJpbmdDb250ZXh0IHtcbiAgYmFja2dyb3VuZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEW107XG4gIG9iamVjdHM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjZW5lR2xvYmFsc0Jhc2VDb25maWcge1xuICBtb3VzZToge1xuICAgIGNsaWNrOiB7XG4gICAgICBsZWZ0OiBib29sZWFuO1xuICAgICAgbWlkZGxlOiBib29sZWFuO1xuICAgICAgcmlnaHQ6IGJvb2xlYW47XG4gICAgfTtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogbnVtYmVyO1xuICAgICAgeTogbnVtYmVyO1xuICAgICAgZXhhY3RYOiBudW1iZXI7IC8vIG5vdCByb3VuZGVkIHRvIHRpbGVcbiAgICAgIGV4YWN0WTogbnVtYmVyOyAvLyBub3Qgcm91bmRlZCB0byB0aWxlXG4gICAgfTtcbiAgfTtcblxuICBrZXlib2FyZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj47XG5cbiAgLy8gVE9ETyhzbWcpOiBjYW1lcmFQb3NpdGlvbiBpcyByZWZlcnJpbmcgdG8gY3VzdG9tUmVuZGVyZXIsIHBlcmhhcHMgcmVuYW1lIGN1c3RvbVJlbmRlcmVyIHRvIGNhbWVyYT9cbiAgY2FtZXJhOiB7XG4gICAgc3RhcnRYOiBudW1iZXI7XG4gICAgc3RhcnRZOiBudW1iZXI7XG4gICAgZW5kWDogbnVtYmVyO1xuICAgIGVuZFk6IG51bWJlcjtcbiAgfTtcbiAgbGF0ZXN0TW91c2VFdmVudDogTW91c2VFdmVudDtcbn1cblxuZXhwb3J0IHR5cGUgQ3VzdG9tUmVuZGVyZXJTaWduYXR1cmUgPSAocmVuZGVyaW5nQ29udGV4dDogU2NlbmVSZW5kZXJpbmdDb250ZXh0KSA9PiB2b2lkO1xuLyoqXG5cbiAgYWRkaW5nIGEgcXVpY2sgZGVzY3JpcHRpb24gaGVyZSBhcyB0aGlzIHNoYXBlIGlzIHByZXR0eSBncm9zcyBidXQgSSB0aGluayBpdCB3aWxsIGJlIHNvbWV3aGF0IHBlcmZvcm1hbnQgYXQgc2NhbGVcbiAgd2hlcmUgPG51bWJlcj4gZnJvbSBsZWZ0IHRvIHJpZ2h0IGlzLCA8c2NlbmUgaW5kZXg+LCA8eCBwb3NpdGlvbj4sIDx5IHBvc2l0aW9uPiwgPGFuaW1hdGlvbiB0aW1lciBpbiBzZWNvbmRzPlxuXG4gIGJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcjogUmVjb3JkPG51bWJlciwgUmVjb3JkPG51bWJlciwgUmVjb3JkPG51bWJlciwgbnVtYmVyPj4+XG4gIGJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lciA9IHtcbiAgICAwOiB7XG4gICAgICAwOiB7XG4gICAgICAgIDA6IDBcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuKi9cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjZW5lIHtcbiAgLy8gYmFja2dyb3VuZFxuICBiYWNrZ3JvdW5kTGF5ZXJzOiBCYWNrZ3JvdW5kTGF5ZXJbXTtcbiAgYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyOiBSZWNvcmQ8bnVtYmVyLCBSZWNvcmQ8bnVtYmVyLCBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+Pj4gPSB7fTsgLy8gdXNlZCBmb3IgdGltaW5ncyBmb3IgYmFja2dyb3VuZCBsYXllciBhbmltYXRpb25zXG5cbiAgLy8gb2JqZWN0c1xuICBvYmplY3RzOiBTY2VuZU9iamVjdFtdID0gW107XG4gIC8vIFRPRE8oc21nKTogaG93IGRvIHdlIGFjY2VzcyB0eXBlcyBmb3IgdGhpcyBmcm9tIHRoZSBzY2VuZSBvYmplY3Q/XG5cbiAgLy8gYSBwbGFjZSB0byBzdG9yZSBmbGFncyBmb3IgdGhlIHNjZW5lXG4gIHJlYWRvbmx5IGdsb2JhbHM6IFNjZW5lR2xvYmFsc0Jhc2VDb25maWcgPSB7XG4gICAgbW91c2U6IHtcbiAgICAgIGNsaWNrOiB7XG4gICAgICAgIGxlZnQ6IGZhbHNlLFxuICAgICAgICBtaWRkbGU6IGZhbHNlLFxuICAgICAgICByaWdodDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgZXhhY3RYOiAwLFxuICAgICAgICBleGFjdFk6IDAsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2FtZXJhOiB7XG4gICAgICBzdGFydFg6IDAsXG4gICAgICBzdGFydFk6IDAsXG4gICAgICBlbmRYOiAwLFxuICAgICAgZW5kWTogMCxcbiAgICB9LFxuICAgIGtleWJvYXJkOiB7fSxcbiAgICBsYXRlc3RNb3VzZUV2ZW50OiBuZXcgTW91c2VFdmVudCgnJyksXG4gIH07XG5cbiAgLy8gbWFwc1xuICAvLyBUT0RPKHNtZyk6IGNoYW5nZSB0aGlzIHNvIHlvdSBjYW4gcGFzcyBpbiBhIG1hcCBjbGFzcyBkaXJlY3RseSBhbmQgdGhlIHR5cGUgdXNlcyBTY2VuZU1hcENvbnN0cnVjdG9yU2lnbmF0dXJlIHwgdW5kZWZpbmVkXG4gIGZsYWdnZWRGb3JNYXBDaGFuZ2U6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDsgLy8gaWYgdGhpcyBpcyBzZXQsIHRoZSBzY2VuZSB3aWxsIGNoYW5nZSB0byB0aGUgbWFwIGF0IHRoZSBwcm92aWRlZCBpbmRleCBvbiB0aGUgbmV4dCBmcmFtZVxuICBtYXBzOiBTY2VuZU1hcENvbnN0cnVjdG9yU2lnbmF0dXJlW10gPSBbXTsgLy8gVE9ETyhzbWcpOiBzb21lIHNvcnQgb2YgYmV0dGVyIHR5cGluZyBmb3IgdGhpcywgaXQgaXMgYSBsaXN0IG9mIHVuaW5zdGFuY2lhdGVkIGNsYXNzZXMgdGhhdCBleHRlbmQgU2NlbmVNYXBcbiAgbWFwOiBTY2VuZU1hcDsgLy8gdGhlIGN1cnJlbnQgbWFwXG5cbiAgLy8gcmVuZGVyaW5nIGNvbnRleHRzXG4gIHJlbmRlcmluZ0NvbnRleHQ6IFNjZW5lUmVuZGVyaW5nQ29udGV4dCA9IHtcbiAgICBiYWNrZ3JvdW5kOiBbXSxcbiAgICBvYmplY3RzOiBbXSxcbiAgfTtcblxuICAvLyBmb3IgZmlyaW5nIGV2ZW50c1xuICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50RW1pdHRlcjogRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2V2ZW50RW1pdHRlcicpO1xuICByZWFkb25seSBldmVudFR5cGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307IC8vIFRPRE8oc21nKTogc29tZSB3YXkgdHlwaW5nIHRoaXMgc28gdGhlcmUgaXMgaW50ZWxsaXNlbnNlIGZvciBldmVudCB0eXBlcyBmb3IgYSBzY2VuZVxuXG4gIHByaXZhdGUgY3VzdG9tUmVuZGVyZXI/OiBDdXN0b21SZW5kZXJlclNpZ25hdHVyZTtcblxuICAvLyBmcm9tIGNsaWVudFxuICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIGFzc2V0czogQXNzZXRzO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBjbGllbnQ6IENsaWVudFxuICApIHtcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNsaWVudC5jb250ZXh0O1xuICAgIHRoaXMuYXNzZXRzID0gdGhpcy5jbGllbnQuYXNzZXRzO1xuXG4gICAgLy8gc2V0IHVwIG1vdXNlIGxpc3RlbmVyXG4gICAgY2xpZW50LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5wb3NpdGlvbiA9IE1vdXNlVXRpbHMuZ2V0TW91c2VQb3NpdGlvbihjbGllbnQuY2FudmFzLCBldmVudCk7XG4gICAgICB0aGlzLmdsb2JhbHMubGF0ZXN0TW91c2VFdmVudCA9IGV2ZW50O1xuICAgIH0pO1xuXG4gICAgLy8gbW91c2VcbiAgICBjbGllbnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1ttb3VzZWRvd25dJywgZXZlbnQpO1xuICAgICAgc3dpdGNoIChldmVudC5idXR0b24pIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5taWRkbGUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLnJpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNsaWVudC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1ttb3VzZXVwXScsIGV2ZW50KTtcbiAgICAgIHN3aXRjaCAoZXZlbnQuYnV0dG9uKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLm1pZGRsZSA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyB0b3VjaFxuICAgIGNsaWVudC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1t0b3VjaHN0YXJ0XScsIGV2ZW50KTtcbiAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGNsaWVudC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdbdG91Y2hlbmRdJywgZXZlbnQpO1xuICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5yZXBlYXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ1trZXlkb3duXScsIGV2ZW50KTtcbiAgICAgIHRoaXMuZ2xvYmFscy5rZXlib2FyZFtldmVudC5rZXkudG9Mb2NhbGVMb3dlckNhc2UoKV0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5yZXBlYXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnW2tleXVwXScsIGV2ZW50KTtcbiAgICAgIHRoaXMuZ2xvYmFscy5rZXlib2FyZFtldmVudC5rZXkudG9Mb2NhbGVMb3dlckNhc2UoKV0gPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGJhY2tncm91bmRMYXllckFuaW1hdGlvbkZyYW1lOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG5cbiAgLy8gVE9ETyhzbWcpOiBtb3ZlIGNsaWVudCByZW5kZXJpbmcgY29kZSBpbnRvIGhlcmVcbiAgZnJhbWUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyQmFja2dyb3VuZChkZWx0YSk7XG4gICAgdGhpcy51cGRhdGVPYmplY3RzKGRlbHRhKTtcbiAgICB0aGlzLnJlbmRlck9iamVjdHMoZGVsdGEpO1xuXG4gICAgaWYgKHRoaXMuY3VzdG9tUmVuZGVyZXIpIHtcbiAgICAgIHRoaXMuY3VzdG9tUmVuZGVyZXIodGhpcy5yZW5kZXJpbmdDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWZhdWx0UmVuZGVyZXIoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJCYWNrZ3JvdW5kKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcudGltaW5nLmZyYW1lQmFja2dyb3VuZCkge1xuICAgICAgY29uc29sZS50aW1lKCdbZnJhbWVdIGJhY2tncm91bmQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmJhY2tncm91bmRMYXllcnMuZm9yRWFjaCgobGF5ZXIsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXMucmVuZGVyaW5nQ29udGV4dC5iYWNrZ3JvdW5kW2luZGV4XTtcbiAgICAgIFJlbmRlclV0aWxzLmNsZWFyQ2FudmFzKGNvbnRleHQpO1xuXG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMubWFwLndpZHRoOyB4KyspIHtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLm1hcC5oZWlnaHQ7IHkrKykge1xuICAgICAgICAgIGxldCB0aWxlID0gbGF5ZXIudGlsZXNbeF0gPyBsYXllci50aWxlc1t4XVt5XSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICh0aWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBhbmltYXRpb25GcmFtZTtcbiAgICAgICAgICBpZiAodGlsZS5hbmltYXRpb25GcmFtZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAvLyBza2lwIGFuaW1hdGlvbnMgaWYgb25seSAxIHNwcml0ZVxuICAgICAgICAgICAgYW5pbWF0aW9uRnJhbWUgPSB0aWxlLmFuaW1hdGlvbkZyYW1lc1swXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGltZXIgaGFzIHN0YXJ0ZWQgZm9yIHNwZWNpZmljIHRpbGUgb24gc3BlY2lmaWMgbGF5ZXJcbiAgICAgICAgICAgIGlmICh0aGlzLmJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcltsYXllci5pbmRleF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcltsYXllci5pbmRleF0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyW2xheWVyLmluZGV4XVt4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyW2xheWVyLmluZGV4XVt4XSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdGltZXI7XG4gICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXJbbGF5ZXIuaW5kZXhdW3hdW3ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdGltZXIgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGltZXIgPSB0aGlzLmJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcltsYXllci5pbmRleF1beF1beV0gKyBkZWx0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gd3JhcCB0aW1lciBpZiBvdmVyIGFuaW1hdGlvbiBmcmFtZSBkdXJhdGlvblxuICAgICAgICAgICAgaWYgKHRpbWVyID4gdGlsZS5hbmltYXRpb25GcmFtZUR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHRpbWVyID0gdGltZXIgJSB0aWxlLmFuaW1hdGlvbkZyYW1lRHVyYXRpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZS5hbmltYXRpb25NYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHRpbWVyIDw9IHRpbGUuYW5pbWF0aW9uTWFwW2ldKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uRnJhbWUgPSB0aWxlLmFuaW1hdGlvbkZyYW1lc1tpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcltsYXllci5pbmRleF1beF1beV0gPSB0aW1lcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzW3RpbGUudGlsZXNldF0sXG4gICAgICAgICAgICBhbmltYXRpb25GcmFtZS5zcHJpdGVYLFxuICAgICAgICAgICAgYW5pbWF0aW9uRnJhbWUuc3ByaXRlWSxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLnRpbWluZy5mcmFtZUJhY2tncm91bmQpIHtcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnW2ZyYW1lXSBiYWNrZ3JvdW5kJyk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlT2JqZWN0cyhkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLnRpbWluZy5mcmFtZVVwZGF0ZSkge1xuICAgICAgY29uc29sZS50aW1lKCdbZnJhbWVdIHVwZGF0ZScpO1xuICAgIH1cblxuICAgIHRoaXMub2JqZWN0cy5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICAgIGlmIChvYmplY3QudXBkYXRlKSB7XG4gICAgICAgIG9iamVjdC51cGRhdGUoZGVsdGEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLnRpbWluZy5mcmFtZVVwZGF0ZSkge1xuICAgICAgY29uc29sZS50aW1lRW5kKCdbZnJhbWVdIHVwZGF0ZScpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlck9iamVjdHMoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy50aW1pbmcuZnJhbWVSZW5kZXIpIHtcbiAgICAgIGNvbnNvbGUudGltZSgnW2ZyYW1lXSByZW5kZXInKTtcbiAgICB9XG5cbiAgICAvLyBjbGVhciBvYmplY3QgY2FudmFzZXNcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQub2JqZWN0cy5mb3JFYWNoKChjb250ZXh0KSA9PiB7XG4gICAgICBSZW5kZXJVdGlscy5jbGVhckNhbnZhcyhjb250ZXh0KTtcbiAgICB9KTtcblxuICAgIC8vIHJlbmRlciBvYmplY3RzXG4gICAgdGhpcy5vYmplY3RzLmZvckVhY2goKG9iamVjdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLm9iamVjdC5yZW5kZXJCYWNrZ3JvdW5kKSB7XG4gICAgICAgIG9iamVjdC5kZWJ1Z2dlclJlbmRlckJhY2tncm91bmQoXG4gICAgICAgICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0Lm9iamVjdHNbb2JqZWN0LnJlbmRlckxheWVyXVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0LnJlbmRlciAmJiBvYmplY3QuaXNSZW5kZXJhYmxlKSB7XG4gICAgICAgIG9iamVjdC5yZW5kZXIoXG4gICAgICAgICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0Lm9iamVjdHNbb2JqZWN0LnJlbmRlckxheWVyXVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbGllbnQuZGVidWcub2JqZWN0LnJlbmRlckJvdW5kYXJ5KSB7XG4gICAgICAgIG9iamVjdC5kZWJ1Z2dlclJlbmRlckJvdW5kYXJ5KFxuICAgICAgICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5vYmplY3RzW29iamVjdC5yZW5kZXJMYXllcl1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy50aW1pbmcuZnJhbWVSZW5kZXIpIHtcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnW2ZyYW1lXSByZW5kZXInKTtcbiAgICB9XG4gIH1cblxuICBkZWZhdWx0UmVuZGVyZXIoKTogdm9pZCB7XG4gICAgLy8gc2V0IGNhbWVyYSBwb3NpdGlvbnNcbiAgICB0aGlzLmdsb2JhbHMuY2FtZXJhLnN0YXJ0WCA9IDA7XG4gICAgdGhpcy5nbG9iYWxzLmNhbWVyYS5zdGFydFkgPSAwO1xuICAgIHRoaXMuZ2xvYmFscy5jYW1lcmEuZW5kWCA9IDA7XG4gICAgdGhpcy5nbG9iYWxzLmNhbWVyYS5lbmRZID0gMDtcblxuICAgIC8vIHJlbmRlclxuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5iYWNrZ3JvdW5kLmZvckVhY2goKGNvbnRleHQpID0+IHtcbiAgICAgIHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoY29udGV4dC5jYW52YXMsIDAsIDApO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5vYmplY3RzLmZvckVhY2goKGNvbnRleHQpID0+IHtcbiAgICAgIHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoY29udGV4dC5jYW52YXMsIDAsIDApO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkT2JqZWN0KHNjZW5lT2JqZWN0OiBTY2VuZU9iamVjdCk6IHZvaWQge1xuICAgIHRoaXMub2JqZWN0cy5wdXNoKHNjZW5lT2JqZWN0KTtcbiAgfVxuXG4gIC8vIFRPRE8oc21nKTogSSBhbSByZXRoaW5raW5nIHRoZSBjb25jZXB0IG9mIHJlbW92aW5nIHRoZSBvYmplY3QgZnJvbSB0aGUgc2NlbmUgZHVyaW5nIGFub3RoZXIgb2JqZWN0J3MgdXBkYXRlLlxuICAvLyBJIHRoaW5rIGl0IHdvdWxkIGJlIGJldHRlciB0byBoYXZlIGEgZmxhZyB0aGF0IGlzIGNoZWNrZWQgZHVyaW5nIHRoZSBzY2VuZSdzIHVwZGF0ZSBsb29wIHRvIHJtb3ZlIHRoZSBvYmVqY3QgYmVmb3JlIGl0J3MgbmV4dCB1cGRhdGVcbiAgLy8gcGVyaGFwcyB1c2luZyBmbGFnZ2VkRm9yRGVzdHJveVxuICByZW1vdmVPYmplY3Qoc2NlbmVPYmplY3Q6IFNjZW5lT2JqZWN0KTogdm9pZCB7XG4gICAgaWYgKHNjZW5lT2JqZWN0LmRlc3Ryb3kpIHtcbiAgICAgIHNjZW5lT2JqZWN0LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5vYmplY3RzLnNwbGljZSh0aGlzLm9iamVjdHMuaW5kZXhPZihzY2VuZU9iamVjdCksIDEpO1xuICB9XG5cbiAgLy8gVE9ETyhzbWcpOiB0aGlzIHByZXZlbnRzIHdlaXJkIGlzc3VlcyBjYXVzZWQgYnkgY2FsbGluZyByZW1vdmVPYmplY3QgbXVsdGlwbGUgdGltZXMgZGlyZWN0bHkgZm9yIHRoZSBzYW1lIG9iamVjdCBidXQgaXQgaXMgaW5lZmZpY2llbnRcbiAgLy8gcmV2aWV3IHRoaXMgYXQgYSBsYXRlciBzdGFnZVxuICByZW1vdmVPYmplY3RCeUlkKHNjZW5lT2JqZWN0SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBvYmplY3QgPSB0aGlzLm9iamVjdHMuZmluZChvID0+IG8uaWQgPT09IHNjZW5lT2JqZWN0SWQpO1xuICAgIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZU9iamVjdChvYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIGluc3RhbmNlcyBvZiB0aGUgcHJvdmlkZWQgY2xhc3NcbiAgICogQHBhcmFtIHR5cGVcbiAgICogQHJldHVybnNcbiAgICovXG4gIGdldE9iamVjdHNCeVR5cGUodHlwZTogYW55KTogU2NlbmVPYmplY3RbXSB7XG4gICAgLy8gVE9ETyhzbWcpOiBob3JyaWJseSB1bmRlcnBlcmZvcm1hbnQsIHBlcmhhcHMgdXNlIGEgaGFzaCBvbiBvYmplY3QgdHlwZSBpbnN0ZWFkP1xuICAgIHJldHVybiB0aGlzLm9iamVjdHMuZmlsdGVyKG8gPT4gbyBpbnN0YW5jZW9mIHR5cGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbiBvYmplY3QgZXhpc3RzIGF0IHRoZSBwcm92aWRlZCBwb3NpdGlvbiBhbmQgaGFzIGNvbGxpc2lvblxuICAgKiBAcGFyYW0geFxuICAgKiBAcGFyYW0geVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgaGFzQ29sbGlzaW9uQXRQb3NpdGlvbihwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHNjZW5lT2JqZWN0PzogU2NlbmVPYmplY3QpOiBib29sZWFuIHtcbiAgICBsZXQgb2JqZWN0ID0gdGhpcy5vYmplY3RzLmZpbmQobyA9PiBvLnBvc2l0aW9uWCA9PT0gcG9zaXRpb25YICYmIG8ucG9zaXRpb25ZID09PSBwb3NpdGlvblkgJiYgby5oYXNDb2xsaXNpb24pO1xuICAgIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGlnbm9yZSBwcm92aWRlZCBvYmplY3QgKHVzdWFsbHkgc2VsZilcbiAgICBpZiAoc2NlbmVPYmplY3QgPT09IG9iamVjdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbiBvYmplY3QgaXMgb24gaXQncyB3YXkgdG8gdGhlIHByb3ZpZGVkIHBvc2l0aW9uIGFuZCBoYXMgY29sbGlzaW9uXG4gICAqIEBwYXJhbSB4XG4gICAqIEBwYXJhbSB5XG4gICAqIEByZXR1cm5zXG4gICAqL1xuICB3aWxsSGF2ZUNvbGxpc2lvbkF0UG9zaXRpb24ocG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCBzY2VuZU9iamVjdD86IFNjZW5lT2JqZWN0KTogYm9vbGVhbiB7XG4gICAgbGV0IG9iamVjdCA9IHRoaXMub2JqZWN0cy5maW5kKG8gPT4gby50YXJnZXRYID09PSBwb3NpdGlvblggJiYgby50YXJnZXRZID09PSBwb3NpdGlvblkgJiYgby5oYXNDb2xsaXNpb24pO1xuICAgIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGlnbm9yZSBwcm92aWRlZCBvYmplY3QgKHVzdWFsbHkgc2VsZilcbiAgICBpZiAoc2NlbmVPYmplY3QgPT09IG9iamVjdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNPdXRPZkJvdW5kcyhwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHBvc2l0aW9uWCA+IHRoaXMubWFwLndpZHRoIC0gMSB8fCBwb3NpdGlvblkgPiB0aGlzLm1hcC5oZWlnaHQgLSAxIHx8IHBvc2l0aW9uWCA8IDAgfHwgcG9zaXRpb25ZIDwgMCk7XG4gIH1cblxuICAvKipcbiAgICogQSBjb21iaW5hdGlvbiBvZiBoYXNDb2xsaXNpb25BdFBvc2l0aW9uIGFuZCB3aWxsSGF2ZUNvbGxpc2lvbkF0UG9zaXRpb25cbiAgICogQHBhcmFtIHBvc2l0aW9uWFxuICAgKiBAcGFyYW0gcG9zaXRpb25ZXG4gICAqIEBwYXJhbSBzY2VuZU9iamVjdFxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgaGFzT3JXaWxsSGF2ZUNvbGxpc2lvbkF0UG9zaXRpb24ocG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCBzY2VuZU9iamVjdD86IFNjZW5lT2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaGFzQ29sbGlzaW9uQXRQb3NpdGlvbihwb3NpdGlvblgsIHBvc2l0aW9uWSwgc2NlbmVPYmplY3QpIHx8IHRoaXMud2lsbEhhdmVDb2xsaXNpb25BdFBvc2l0aW9uKHBvc2l0aW9uWCwgcG9zaXRpb25ZLCBzY2VuZU9iamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyB0aGUgZmlyc3Qgb2JqZWN0IGZvdW5kIGF0IHRoZSBwcm92aWRlZCBwb3NpdGlvblxuICAgKiBAcGFyYW0gcG9zaXRpb25YXG4gICAqIEBwYXJhbSBwb3NpdGlvbllcbiAgICogQHBhcmFtIHR5cGVcbiAgICogQHJldHVybnNcbiAgICovXG4gIGdldE9iamVjdEF0UG9zaXRpb24ocG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCB0eXBlPzogYW55KTogU2NlbmVPYmplY3QgfCB1bmRlZmluZWQge1xuICAgIC8vIFRPRE8oc21nKTogYWRkIG9wdGlvbmFsIHR5cGUgY2hlY2tcbiAgICAvLyBUT0RPKHNtZyk6IHRoaXMgaXMgYSB2ZXJ5IGhlYXZ5IG9wZXJhdGlvblxuICAgIHJldHVybiB0aGlzLm9iamVjdHMuZmluZChvID0+IG8ucG9zaXRpb25YID09PSBwb3NpdGlvblggJiYgby5wb3NpdGlvblkgPT09IHBvc2l0aW9uWSAmJiBvLmNvbGxpc2lvbkxheWVyICE9PSBDYW52YXNDb25zdGFudHMuVUlfQ09MTElTSU9OX0xBWUVSKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGFsbCBvYmplY3RzIGZvdW5kIGF0IHRoZSBwcm92aWRlZCBwb3NpdGlvblxuICAgKiBAcGFyYW0gcG9zaXRpb25YXG4gICAqIEBwYXJhbSBwb3NpdGlvbllcbiAgICogQHBhcmFtIHR5cGVcbiAgICogQHJldHVybnNcbiAgICovXG4gIGdldEFsbE9iamVjdHNBdFBvc2l0aW9uKHBvc2l0aW9uWDogbnVtYmVyLCBwb3NpdGlvblk6IG51bWJlciwgdHlwZT86IGFueSk6IFNjZW5lT2JqZWN0W10ge1xuICAgIC8vIFRPRE8oc21nKTogYWRkIG9wdGlvbmFsIHR5cGUgY2hlY2tcbiAgICAvLyBUT0RPKHNtZyk6IHRoaXMgaXMgYSB2ZXJ5IGhlYXZ5IG9wZXJhdGlvblxuICAgIHJldHVybiB0aGlzLm9iamVjdHMuZmlsdGVyKG8gPT4gby5wb3NpdGlvblggPT09IHBvc2l0aW9uWCAmJiBvLnBvc2l0aW9uWSA9PT0gcG9zaXRpb25ZICYmIG8uY29sbGlzaW9uTGF5ZXIgIT09IENhbnZhc0NvbnN0YW50cy5VSV9DT0xMSVNJT05fTEFZRVIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVBbGxPYmplY3RzKCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5yZW1vdmVPYmplY3QodGhpcy5vYmplY3RzWzBdKTtcbiAgICB9XG4gICAgLy8gdGhpcy5vYmplY3RzID0gW107XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUFsbEJhY2tncm91bmRMYXllcnMoKTogdm9pZCB7XG4gICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzID0gW107XG4gIH1cblxuICBzZXRVcFJlbmRlcmluZ0NvbnRleHRzKCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IHtcbiAgICAgIGJhY2tncm91bmQ6IFtdLFxuICAgICAgb2JqZWN0czogW10sXG4gICAgfTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQuYmFja2dyb3VuZFtpXSA9IHRoaXMuY3JlYXRlQ2FudmFzKCkuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5iYWNrZ3JvdW5kW2ldLmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IENhbnZhc0NvbnN0YW50cy5PQkpFQ1RfUkVOREVSSU5HX0xBWUVSUzsgaSsrKSB7XG4gICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQub2JqZWN0c1tpXSA9IHRoaXMuY3JlYXRlQ2FudmFzKCkuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5vYmplY3RzW2ldLmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICBsZXQgY2FudmFzID0gUmVuZGVyVXRpbHMuY3JlYXRlQ2FudmFzKHRoaXMubWFwLndpZHRoLCB0aGlzLm1hcC5oZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLnVpLmNhbnZhc0xheWVycykge1xuICAgICAgdGhpcy5jbGllbnQuY29udGFpbmVyLmFwcGVuZChjYW52YXMpO1xuICAgIH1cblxuICAgIHJldHVybiBjYW52YXM7XG4gIH1cblxuICBmbGFnRm9yTWFwQ2hhbmdlKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmZsYWdnZWRGb3JNYXBDaGFuZ2UgPSBpbmRleDtcbiAgfVxuXG4gIC8vIFRPRE8oc21nKTogYWxsb3cgdGhpcyB0byBoYXZlIGEgdGltZXIgc2V0IGZvciBpdFxuICBjaGFuZ2VNYXAoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIGNsZWFuIHVwIG1hcFxuICAgIGlmICh0aGlzLm1hcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm1hcC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gY2xlYW4gdXAgc2NlbmVcbiAgICAvLyBUT0RPKHNtZyk6IHNvbWUgc29ydCBvZiBzY2VuZSByZXNldCBmdW5jdGlvblxuICAgIHRoaXMucmVtb3ZlQWxsT2JqZWN0cygpO1xuICAgIHRoaXMucmVtb3ZlQWxsQmFja2dyb3VuZExheWVycygpO1xuXG4gICAgLy8gc2V0IHVwIG5ldyBtYXBcbiAgICBjb25zb2xlLmxvZygnW1NjZW5lXSBjaGFuZ2luZyBtYXAgdG8nLCBpbmRleCk7XG4gICAgdGhpcy5tYXAgPSBSZWZsZWN0LmNvbnN0cnVjdCh0aGlzLm1hcHNbaW5kZXhdLCBbdGhpcywgdGhpcy5jb250ZXh0LCB0aGlzLmFzc2V0c10pO1xuICAgIHRoaXMuYmFja2dyb3VuZExheWVycy5wdXNoKC4uLnRoaXMubWFwLmJhY2tncm91bmRMYXllcnMpO1xuICAgIHRoaXMub2JqZWN0cy5wdXNoKC4uLnRoaXMubWFwLm9iamVjdHMpO1xuXG4gICAgLy8gc2V0IHVwIHJlbmRlcmluZyBjb250ZXh0c1xuICAgIC8vIGN1c3RvbSByZW5kZXJlcnMgaW4gb2JqZWN0cyBmb3IgbWFwcyByZXF1aXJlIHRoaXNcbiAgICB0aGlzLnNldFVwUmVuZGVyaW5nQ29udGV4dHMoKTtcblxuICAgIC8vIHJlbW92ZSBmbGFnXG4gICAgdGhpcy5mbGFnZ2VkRm9yTWFwQ2hhbmdlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgY2hhbmdlU2NlbmUoc2NlbmVDbGFzczogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jbGllbnQuY2hhbmdlU2NlbmUoc2NlbmVDbGFzcyk7XG4gIH1cblxuICBzZXRDdXN0b21SZW5kZXJlcihyZW5kZXJlcjogQ3VzdG9tUmVuZGVyZXJTaWduYXR1cmUpOiB2b2lkIHtcbiAgICB0aGlzLmN1c3RvbVJlbmRlcmVyID0gcmVuZGVyZXI7XG4gIH1cblxuICByZW1vdmVDdXN0b21lclJlbmRlcmVyKCk6IHZvaWQge1xuICAgIHRoaXMuY3VzdG9tUmVuZGVyZXIgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogYW55KTogdm9pZCB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldmVudE5hbWU6IHN0cmluZywgZGV0YWlsPzogYW55KTogdm9pZCB7XG4gICAgbGV0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgeyBkZXRhaWwsIH0pO1xuICAgIGNvbnNvbGUubG9nKCdbZGlzcGF0Y2hFdmVudF0nLCBldmVudCk7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTcHJpdGVBbmltYXRpb24ge1xuICB0aWxlc2V0OiBzdHJpbmc7XG4gIGR1cmF0aW9uOiBudW1iZXI7IC8vIGxlbmd0aCBvZiBhbmltYXRpb24gaW4gc2Vjb25kc1xuICBmcmFtZXM6IFNwcml0ZUFuaW1hdGlvbkZyYW1lW107XG5cbiAgY29uc3RydWN0b3IodGlsZXNldDogc3RyaW5nLCBmcmFtZXM6IFNwcml0ZUFuaW1hdGlvbkZyYW1lW10pIHtcbiAgICB0aGlzLnRpbGVzZXQgPSB0aWxlc2V0O1xuICAgIHRoaXMuZnJhbWVzID0gZnJhbWVzO1xuICAgIHRoaXMuZHVyYXRpb24gPSBmcmFtZXMucmVkdWNlKChhY2MsIGZyYW1lKSA9PiBhY2MgKyBmcmFtZS5kdXJhdGlvbiwgMCk7XG4gIH1cblxuICAvLyByZXR1cm5zIHRoZSBjdXJyZW50IGZyYW1lIG9mIHRoZSBhbmltYXRpb24gYmFzZWQgb24gdGhlIHRpbWVcbiAgY3VycmVudEZyYW1lKHRpbWU6IG51bWJlcik6IFNwcml0ZUFuaW1hdGlvbkZyYW1lIHtcbiAgICBsZXQgY3VycmVudFRpbWUgPSB0aW1lICUgdGhpcy5kdXJhdGlvbjtcbiAgICBsZXQgY3VycmVudER1cmF0aW9uID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyZW50RHVyYXRpb24gKz0gdGhpcy5mcmFtZXNbaV0uZHVyYXRpb247XG4gICAgICBpZiAoY3VycmVudFRpbWUgPCBjdXJyZW50RHVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJhbWVzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5mcmFtZXNbMF07XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTcHJpdGVBbmltYXRpb25GcmFtZSB7XG4gIHNwcml0ZVg6IG51bWJlcjtcbiAgc3ByaXRlWTogbnVtYmVyO1xuICBkdXJhdGlvbjogbnVtYmVyOyAvLyBsZW5ndGggb2YgYW5pbWF0aW9uIGluIHNlY29uZHNcbn1cbiIsImltcG9ydCB7IHR5cGUgU2NlbmUgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZSc7XG5pbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuXG5jb25zdCBERUZBVUxUX0RVUkFUSU9OID0gMTtcbmNvbnN0IERFRkFVTFRfT05fSU5URVJWQUwgPSAoKTogdm9pZCA9PiB7fTtcblxuZXhwb3J0IGludGVyZmFjZSBJbnRlcnZhbE9iamVjdENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIGR1cmF0aW9uPzogbnVtYmVyOyAvLyBkdXJhdGlvbiBvZiBlYWNoIGludGVydmFsIGluIHNlY29uZHMgKGUuZy4gMSA9IDEgc2Vjb25kKVxuICBvbkludGVydmFsPzogKCkgPT4gdm9pZDsgLy8gZnVuY3Rpb24gdG8gY2FsbCBvbiBlYWNoIGludGVydmFsXG4gIG9uRGVzdHJveT86ICgpID0+IHZvaWQ7IC8vIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgb2JqZWN0IGlzIGRlc3Ryb3llZFxuICBtYXhJbnRlcnZhbHM/OiBudW1iZXI7IC8vIG1heGltdW0gbnVtYmVyIG9mIGludGVydmFscyB0byBydW4gYmVmb3JlIGRlc3Ryb3lpbmcgdGhlIG9iamVjdFxufVxuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IHJ1bnMgYSBmdW5jdGlvbiBhdCByZWd1bGFyIGludGVydmFsc1xuICovXG5leHBvcnQgY2xhc3MgSW50ZXJ2YWxPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIHByaXZhdGUgdGltZXIgPSAwO1xuICBwcml2YXRlIGludGVydmFsc0NvbXBsZXRlID0gMDtcbiAgcHJpdmF0ZSByZWFkb25seSBtYXhJbnRlcnZhbHM6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSByZWFkb25seSBkdXJhdGlvbjogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IG9uSW50ZXJ2YWw6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgb25EZXN0cm95PzogKCkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgc2NlbmU6IFNjZW5lLFxuICAgIGNvbmZpZzogSW50ZXJ2YWxPYmplY3RDb25maWdcbiAgKSB7XG4gICAgc3VwZXIoc2NlbmUsIGNvbmZpZyk7XG5cbiAgICB0aGlzLmR1cmF0aW9uID0gY29uZmlnLmR1cmF0aW9uID8/IERFRkFVTFRfRFVSQVRJT047XG4gICAgdGhpcy5vbkludGVydmFsID0gY29uZmlnLm9uSW50ZXJ2YWwgPz8gREVGQVVMVF9PTl9JTlRFUlZBTDtcbiAgICB0aGlzLm9uRGVzdHJveSA9IGNvbmZpZy5vbkRlc3Ryb3kgPz8gdW5kZWZpbmVkO1xuICAgIHRoaXMubWF4SW50ZXJ2YWxzID0gY29uZmlnLm1heEludGVydmFscztcbiAgfVxuXG4gIHVwZGF0ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50aW1lciArPSBkZWx0YTtcblxuICAgIGlmICh0aGlzLnRpbWVyID49IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgIHRoaXMub25JbnRlcnZhbCgpO1xuICAgICAgdGhpcy50aW1lciAtPSB0aGlzLmR1cmF0aW9uOyAvLyByZW1vdmUgdGhlIGR1cmF0aW9uIGZyb20gdGhlIHRpbWVyIHJhdGhlciB0aGFuIHNldCB0byAwIHRvIGF2b2lkIGRyaWZ0XG5cbiAgICAgIHRoaXMuaW50ZXJ2YWxzQ29tcGxldGUrKztcblxuICAgICAgaWYgKHRoaXMubWF4SW50ZXJ2YWxzICYmIHRoaXMuaW50ZXJ2YWxzQ29tcGxldGUgPj0gdGhpcy5tYXhJbnRlcnZhbHMpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3QodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vbkRlc3Ryb3kpIHtcbiAgICAgIHRoaXMub25EZXN0cm95KCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdbSW50ZXJ2YWxPYmplY3RdIGRlc3Ryb3llZCcpO1xuICB9XG59XG4iLCJpbXBvcnQgeyB0eXBlIFNjZW5lIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBvc2l0aW9uWDogbnVtYmVyO1xuICBwb3NpdGlvblk6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHRpbGVzZXQ6IHN0cmluZztcbiAgc3ByaXRlWTogbnVtYmVyO1xuICBzcHJpdGVYOiBudW1iZXI7XG4gIHJlbmRlckxheWVyPzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU3ByaXRlT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuICBoYXNDb2xsaXNpb24gPSBmYWxzZTtcblxuICB0aWxlc2V0OiBzdHJpbmc7XG4gIHNwcml0ZVg6IG51bWJlcjtcbiAgc3ByaXRlWTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogU2NlbmUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc2NlbmUsIGNvbmZpZyk7XG5cbiAgICB0aGlzLndpZHRoID0gY29uZmlnLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcbiAgICB0aGlzLnRpbGVzZXQgPSBjb25maWcudGlsZXNldDtcbiAgICB0aGlzLnNwcml0ZVggPSBjb25maWcuc3ByaXRlWDtcbiAgICB0aGlzLnNwcml0ZVkgPSBjb25maWcuc3ByaXRlWTtcbiAgICB0aGlzLnJlbmRlckxheWVyID0gY29uZmlnLnJlbmRlckxheWVyID8/IDA7XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgY29udGV4dCxcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1snc3ByaXRlcyddLFxuICAgICAgdGhpcy5zcHJpdGVYLFxuICAgICAgdGhpcy5zcHJpdGVZLFxuICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICB0aGlzLnBvc2l0aW9uWSxcbiAgICAgIHRoaXMud2lkdGgsXG4gICAgICB0aGlzLmhlaWdodFxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRoVXRpbHMge1xuICAvLyBpbmNsdWRpbmcgbWluIGFuZCBtYXhcbiAgc3RhdGljIHJhbmRvbUludEZyb21SYW5nZShtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMucmFuZG9tTnVtYmVyRnJvbVJhbmdlKG1pbiwgbWF4KSk7XG4gIH1cblxuICBzdGF0aWMgcmFuZG9tTnVtYmVyRnJvbVJhbmdlKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW47XG4gIH1cblxuICAvLyBmb3IgYWRkaW5nIGEgYml0IG9mIHJhbmRvbW5lc3MgdG8gYW5pbWF0aW9uIHN0YXJ0IHRpbWVzXG4gIHN0YXRpYyByYW5kb21TdGFydGluZ0RlbHRhKHNlY29uZHM/OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKHNlY29uZHMgPz8gMSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJy4uL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBNb3VzZVBvc2l0aW9uIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIGV4YWN0WDogbnVtYmVyO1xuICBleGFjdFk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vdXNlVXRpbHMge1xuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBtb3VzZSBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY2FudmFzLCB0YWtpbmcgaW50byBhY2NvdW50IGZ1bGxzY3JlZW4gbW9kZVxuICAgKiBGdWxsc2NyZWVuIG1vZGUgYWRqdXN0cyB0aGUgaGVpZ2h0IGlmIGxhbmRzY2FwZSwgb3Igd2lkdGggaWYgcG9ydHJhaXQsIG9mIHRoZSBjYW52YXMgZWxlbWVudCwgYnV0IG5vdCB0aGUgcGl4ZWwgc2l6ZSBvZiB0aGUgY2FudmFzLCBzbyB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgbW91c2UgcG9zaXRpb24gYWNjb3JkaW5nbHlcbiAgICogQHBhcmFtIGNhbnZhc1xuICAgKiBAcGFyYW0gZXZ0XG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBzdGF0aWMgZ2V0TW91c2VQb3NpdGlvbihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBldmVudDogTW91c2VFdmVudCk6IE1vdXNlUG9zaXRpb24ge1xuICAgIGxldCBib3VuZGluZ1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBsZXQgYWRqdXN0ZWRCb3VudGluZ1JlY3QgPSB7XG4gICAgICBoZWlnaHQ6IGJvdW5kaW5nUmVjdC5oZWlnaHQsXG4gICAgICB3aWR0aDogYm91bmRpbmdSZWN0LndpZHRoLFxuICAgIH07XG5cbiAgICBsZXQgYWRqdXN0ZWRFdmVudCA9IHtcbiAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgIH07XG5cbiAgICAvLyB3aGVuIGNhbnZhcyBpcyBpbiBmdWxsc2NyZWVuIG1vZGUsIHRoZSBjYW52YXMgd2lsbCBiZSBjZW50ZXJlZCBpbiB0aGUgd2luZG93LCBtZXNzaW5nIHVwIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgYXhpcyB0aGF0IGlzbid0IGZ1bGwgd2lkdGggb3IgaGVpZ2h0XG4gICAgbGV0IHJhdGlvOyAvLyByYXRpbyBvZiBjYW52YXMgZWxlbWVudCBzaXplIHRvIGNhbnZhcyBwaXhlbCBzaXplXG4gICAgaWYgKGNhbnZhcy53aWR0aCA+IGNhbnZhcy5oZWlnaHQpIHtcbiAgICAgIHJhdGlvID0gY2FudmFzLndpZHRoIC8gYm91bmRpbmdSZWN0LndpZHRoOyAvLyByYXRpbyBvZiBjYW52YXMgZWxlbWVudCBzaXplIHRvIGNhbnZhcyBwaXhlbCBzaXplXG5cbiAgICAgIC8vIGFkanVzdCBib3VuZGluZyByZWN0XG4gICAgICBhZGp1c3RlZEJvdW50aW5nUmVjdC5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gcmF0aW87XG5cbiAgICAgIC8vIGFkanVzdCBjbGljayBwb3NpdGlvblxuICAgICAgbGV0IGFkZGl0aW9uYWxIZWlnaHQgPSAoYm91bmRpbmdSZWN0LmhlaWdodCAtIGFkanVzdGVkQm91bnRpbmdSZWN0LmhlaWdodCk7XG4gICAgICBhZGp1c3RlZEV2ZW50LmNsaWVudFkgLT0gKGFkZGl0aW9uYWxIZWlnaHQgLyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmF0aW8gPSBjYW52YXMuaGVpZ2h0IC8gYm91bmRpbmdSZWN0LmhlaWdodDsgLy8gcmF0aW8gb2YgY2FudmFzIGVsZW1lbnQgc2l6ZSB0byBjYW52YXMgcGl4ZWwgc2l6ZVxuXG4gICAgICAvLyBhZGp1c3QgYm91bmRpbmcgcmVjdFxuICAgICAgYWRqdXN0ZWRCb3VudGluZ1JlY3Qud2lkdGggPSBjYW52YXMud2lkdGggLyByYXRpbztcblxuICAgICAgLy8gYWRqdXN0IGNsaWNrIHBvc2l0aW9uXG4gICAgICBsZXQgYWRkaXRpb25hbFdpZHRoID0gKGJvdW5kaW5nUmVjdC53aWR0aCAtIGFkanVzdGVkQm91bnRpbmdSZWN0LndpZHRoKTtcbiAgICAgIGFkanVzdGVkRXZlbnQuY2xpZW50WCAtPSAoYWRkaXRpb25hbFdpZHRoIC8gMik7XG4gICAgfVxuXG4gICAgbGV0IHNjYWxlWCA9IGNhbnZhcy53aWR0aCAvIGFkanVzdGVkQm91bnRpbmdSZWN0LndpZHRoO1xuICAgIGxldCBzY2FsZVkgPSBjYW52YXMuaGVpZ2h0IC8gYWRqdXN0ZWRCb3VudGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgLy8gc2NhbGUgbW91c2UgY29vcmRpbmF0ZXMgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gYWRqdXN0ZWQgdG8gYmUgcmVsYXRpdmUgdG8gZWxlbWVudFxuICAgIGxldCB4ID0gKChhZGp1c3RlZEV2ZW50LmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdCkgKiBzY2FsZVgpIC8gQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgICBsZXQgeSA9ICgoYWRqdXN0ZWRFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcCkgKiBzY2FsZVkpIC8gQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogTWF0aC5mbG9vcih4KSxcbiAgICAgIHk6IE1hdGguZmxvb3IoeSksXG4gICAgICBleGFjdFg6IHgsXG4gICAgICBleGFjdFk6IHksXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBzZXRDdXJzb3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgY3Vyc29yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjYW52YXMuc3R5bGUuY3Vyc29yID0gYHVybChcIiR7Y3Vyc29yfVwiKSwgYXV0b2A7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXQgaXNGdWxsc2NyZWVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCAhPT0gbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBpc0NsaWNrV2l0aGluKG1vdXNlUG9zaXRpb246IE1vdXNlUG9zaXRpb24sIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBtb3VzZVBvc2l0aW9uLmV4YWN0WCA+PSB4ICYmXG4gICAgICBtb3VzZVBvc2l0aW9uLmV4YWN0WCA8PSB4ICsgd2lkdGggJiZcbiAgICAgIG1vdXNlUG9zaXRpb24uZXhhY3RZID49IHkgJiZcbiAgICAgIG1vdXNlUG9zaXRpb24uZXhhY3RZIDw9IHkgKyBoZWlnaHRcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICcuLi9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZW5kZXJVdGlscyB7XG4gIHN0YXRpYyByZW5kZXJTcHJpdGUoXG4gICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHNwcml0ZVNoZWV0OiBIVE1MSW1hZ2VFbGVtZW50LFxuICAgIHNwcml0ZVg6IG51bWJlcixcbiAgICBzcHJpdGVZOiBudW1iZXIsXG4gICAgcG9zaXRpb25YOiBudW1iZXIsXG4gICAgcG9zaXRpb25ZOiBudW1iZXIsXG4gICAgc3ByaXRlV2lkdGg/OiBudW1iZXIsXG4gICAgc3ByaXRlSGVpZ2h0PzogbnVtYmVyLFxuICAgIG9wdGlvbnM6IHsgc2NhbGU/OiBudW1iZXI7IG9wYWNpdHk/OiBudW1iZXI7IHR5cGU/OiAndGlsZScgfCAncGl4ZWwnOyByb3RhdGlvbj86IG51bWJlcjsgfSA9IHsgfSAvLyBUT0RPKHNtZyk6IGltcGxlbWVudCB0aWxlIHZzIHBpeGVsXG4gICk6IHZvaWQge1xuICAgIGxldCB3aWR0aCA9IHNwcml0ZVdpZHRoID8gc3ByaXRlV2lkdGggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFIDogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgICBsZXQgaGVpZ2h0ID0gc3ByaXRlSGVpZ2h0ID8gc3ByaXRlSGVpZ2h0ICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSA6IENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkU7XG4gICAgbGV0IHNjYWxlID0gb3B0aW9ucy5zY2FsZSA/PyAxOyAvLyB1c2UgdG8gc2NhbGUgdGhlIG91dHB1dFxuICAgIGxldCByb3RhdGlvbiA9IG9wdGlvbnMucm90YXRpb24gPz8gMDsgLy8gdXNlIHRvIHJvdGF0ZSB0aGUgb3V0cHV0XG5cbiAgICAvLyBzYXZlIHRoZSBjdXJyZW50IGNvbnRleHQgaWYgd2UgbmVlZCB0byBhcHBseSBvcGFjaXR5LCB0aGVuIHJlc3RvcmUgaXQgYWZ0ZXJcbiAgICAvLyB3ZSBkb24ndCBkbyB0aGlzIGZvciBhbGwgcmVuZGVycyBhcyBpdCBpcyBhIHBlcmZvcm1hbmNlIGhpdFxuICAgIGxldCB1cGRhdGVPcGFjaXR5ID0gKG9wdGlvbnMub3BhY2l0eSAmJiBvcHRpb25zLm9wYWNpdHkgPCAxKTtcbiAgICBsZXQgdXBkYXRlUm90YXRpb24gPSAocm90YXRpb24gIT09IDApO1xuXG4gICAgbGV0IHNob3VsZFNhdmUgPSAodXBkYXRlT3BhY2l0eSB8fCB1cGRhdGVSb3RhdGlvbik7XG4gICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgIGNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICBpZiAodXBkYXRlT3BhY2l0eSkge1xuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gTWF0aC5tYXgoMCwgb3B0aW9ucy5vcGFjaXR5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVwZGF0ZVJvdGF0aW9uKSB7XG4gICAgICAgIC8vIFRPRE8oc21nKTogY29tcGxldGVseSBidXN0ZWQsIHdpbGwgZmlndXJlIG91dCBsYXRlclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShwb3NpdGlvblgsIHBvc2l0aW9uWSk7XG4gICAgICAgIGNvbnRleHQucm90YXRlKCg0NSAqIE1hdGguUEkpIC8gMTgwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgIHNwcml0ZVNoZWV0LFxuICAgICAgc3ByaXRlWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUsIC8vIHRyYW5zbGF0ZSBzcHJpdGUgcG9zaXRpb24gdG8gcGl4ZWwgcG9zaXRpb25cbiAgICAgIHNwcml0ZVkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFLCAvLyB0cmFuc2xhdGUgc3ByaXRlIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIE1hdGguZmxvb3IocG9zaXRpb25YICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksIC8vIHRyYW5zbGF0ZSBncmlkIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uLCByb3VuZGVkIHRvIG5lYXJlc3QgcGl4ZWwgdG8gcHJldmVudCBibHVycmluZ1xuICAgICAgTWF0aC5mbG9vcihwb3NpdGlvblkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSwgLy8gdHJhbnNsYXRlIGdyaWQgcG9zaXRpb24gdG8gcGl4ZWwgcG9zaXRpb24sIHJvdW5kZWQgdG8gbmVhcmVzdCBwaXhlbCB0byBwcmV2ZW50IGJsdXJyaW5nXG4gICAgICB3aWR0aCAqIHNjYWxlLFxuICAgICAgaGVpZ2h0ICogc2NhbGVcbiAgICApO1xuXG4gICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJTdWJzZWN0aW9uKFxuICAgIHNvdXJjZTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIGRlc3RpbmF0aW9uOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgc3RhcnRYOiBudW1iZXIsXG4gICAgc3RhcnRZOiBudW1iZXIsXG4gICAgZW5kWDogbnVtYmVyLFxuICAgIGVuZFk6IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBsZXQgc3RhcnRYUGl4ZWwgPSBNYXRoLmZsb29yKHN0YXJ0WCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpO1xuICAgIGxldCBzdGFydFlQaXhlbCA9IE1hdGguZmxvb3Ioc3RhcnRZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSk7XG4gICAgbGV0IGVuZFhQaXhlbCA9IE1hdGguZmxvb3IoZW5kWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpO1xuICAgIGxldCBlbmRZUGl4ZWwgPSBNYXRoLmZsb29yKGVuZFkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKTtcblxuICAgIGRlc3RpbmF0aW9uLmRyYXdJbWFnZShcbiAgICAgIHNvdXJjZS5jYW52YXMsXG4gICAgICBzdGFydFhQaXhlbCxcbiAgICAgIHN0YXJ0WVBpeGVsLFxuICAgICAgZW5kWFBpeGVsIC0gc3RhcnRYUGl4ZWwsXG4gICAgICBlbmRZUGl4ZWwgLSBzdGFydFlQaXhlbCxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgZGVzdGluYXRpb24uY2FudmFzLndpZHRoLFxuICAgICAgZGVzdGluYXRpb24uY2FudmFzLmhlaWdodFxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgcmVuZGVyQ2lyY2xlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCBvcHRpb25zOiB7IGNvbG91cj86IHN0cmluZzsgfSA9IHt9KTogdm9pZCB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyhcbiAgICAgIChwb3NpdGlvblggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSArIChDYW52YXNDb25zdGFudHMuVElMRV9TSVpFIC8gMiksXG4gICAgICAocG9zaXRpb25ZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyAoQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAvIDIpLFxuICAgICAgQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAvIDIsXG4gICAgICAwLFxuICAgICAgMiAqIE1hdGguUElcbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBvcHRpb25zLmNvbG91ciB8fCAnc2FkZGxlYnJvd24nO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9XG5cbiAgLy8gVE9ETyhzbWcpOiB0aGlzIGlzIHVzaW5nIGEgbWl4dHVyZSBvZiBwaXhlbCBhbmQgdGlsZSBjb29yZGluYXRlcywgbmVlZCB0byBzdGFuZGFyZGl6ZVxuICBzdGF0aWMgZmlsbFJlY3RhbmdsZShcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgcG9zaXRpb25YOiBudW1iZXIsXG4gICAgcG9zaXRpb25ZOiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICBvcHRpb25zOiB7IGNvbG91cj86IHN0cmluZzsgdHlwZT86ICdwaXhlbCcgfCAndGlsZSc7IH0gPSB7IH1cbiAgKTogdm9pZCB7XG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IG9wdGlvbnMuY29sb3VyID8gb3B0aW9ucy5jb2xvdXIgOiAnYmxhY2snO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9ucy5jb2xvdXIgPyBvcHRpb25zLmNvbG91ciA6ICdibGFjayc7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LnJlY3QoXG4gICAgICBNYXRoLmZsb29yKHBvc2l0aW9uWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLCAvLyArMC41IHRvIHByZXZlbnQgYmx1cnJpbmcgYnV0IHRoYXQgY2F1c2VzIGFkZGl0aW9uYWwgaXNzdWVzXG4gICAgICBNYXRoLmZsb29yKHBvc2l0aW9uWSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLCAvLyArMC41IHRvIHByZXZlbnQgYmx1cnJpbmcgYnV0IHRoYXQgY2F1c2VzIGFkZGl0aW9uYWwgaXNzdWVzXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodFxuICAgICk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuXG4gIHN0YXRpYyBzdHJva2VSZWN0YW5nbGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjb2xvdXI/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgLy8gY2FudmFzIHJlbmRlcnMgb24gYSBoYWxmIHBpeGVsIHNvIHdlIG5lZWQgdG8gb2Zmc2V0IGJ5IC41IGluIG9yZGVyIHRvIGdldCB0aGUgc3Ryb2tlIHdpZHRoIHRvIGJlIDFweCwgb3RoZXJ3aXNlIGl0IHdhcyAycHggd2lkZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM4Nzk0MDJcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgY29udGV4dC5zdHJva2VSZWN0KHBvc2l0aW9uWCArIDAuNSwgcG9zaXRpb25ZICsgMC41LCB3aWR0aCAtIDEsIGhlaWdodCAtIDEpO1xuICB9XG5cbiAgc3RhdGljIGNsZWFyQ2FudmFzKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNvbnRleHQuY2FudmFzLndpZHRoLCBjb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUNhbnZhcyh3aWR0aD86IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIC8vIGNyZWF0ZSBjYW52YXNcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBjYW52YXNcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aCA/IHdpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSA6IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfV0lEVEg7XG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodCA/IGhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgOiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX0hFSUdIVDtcblxuICAgIHJldHVybiBjYW52YXM7XG4gIH1cblxuICBzdGF0aWMgcG9zaXRpb25Ub1BpeGVsUG9zaXRpb24ocG9zaXRpb246IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHBvc2l0aW9uICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJUZXh0KFxuICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgcG9zaXRpb25YOiBudW1iZXIsXG4gICAgcG9zaXRpb25ZOiBudW1iZXIsXG4gICAgb3B0aW9uczogeyBzaXplPzogbnVtYmVyOyBjb2xvdXI/OiBzdHJpbmc7IH0gPSB7fVxuICApOiB2b2lkIHtcbiAgICBsZXQgc2l6ZSA9IG9wdGlvbnMuc2l6ZSA/IG9wdGlvbnMuc2l6ZSA6IDE2O1xuICAgIGxldCBjb2xvdXIgPSBvcHRpb25zLmNvbG91ciA/IG9wdGlvbnMuY29sb3VyIDogJ2JsYWNrJztcblxuICAgIGNvbnRleHQuZm9udCA9IGAke3NpemV9cHggSGVsdmV0aWNhYDtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGAke2NvbG91cn1gO1xuICAgIGNvbnRleHQuZmlsbFRleHQoXG4gICAgICB0ZXh0LFxuICAgICAgcG9zaXRpb25YICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSwgLy8gdHJhbnNsYXRlIHNwcml0ZSBwb3NpdGlvbiB0byBwaXhlbCBwb3NpdGlvblxuICAgICAgcG9zaXRpb25ZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAvLyB0cmFuc2xhdGUgc3ByaXRlIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyB0ZXh0VG9BcnJheShcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBvcHRpb25zOiB7IHNpemU/OiBudW1iZXI7IGNvbG91cj86IHN0cmluZzsgfSA9IHt9XG4gICk6IHN0cmluZ1tdIHtcbiAgICAvLyBkZWZhdWx0c1xuICAgIGxldCBzaXplID0gb3B0aW9ucy5zaXplID8/IDE2O1xuICAgIGxldCBjb2xvdXIgPSBvcHRpb25zLmNvbG91ciA/PyAnYmxhY2snO1xuXG4gICAgLy8gY29uZmlndXJlIGNvbnRleHRcbiAgICBsZXQgY29udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQoJzJkJyk7XG4gICAgY29udGV4dC5mb250ID0gYCR7c2l6ZX1weCBIZWx2ZXRpY2FgO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gYCR7Y29sb3VyfWA7XG5cbiAgICAvLyBzcGxpdCB3b3JkcyB0aGVuIGNyZWF0ZSBuZXcgbGluZSBvbmNlIGV4Y2VlZGluZyB3aWR0aFxuICAgIGxldCB3b3JkcyA9IHRleHQuc3BsaXQoJyAnKTtcbiAgICBsZXQgY3VycmVudExpbmUgPSAnJztcbiAgICBsZXQgb3V0cHV0ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdXBkYXRlZExpbmUgPSBgJHtjdXJyZW50TGluZX0gJHt3b3Jkc1tpXX1gO1xuXG4gICAgICAvLyB3aWR0aCBleGNlZWRlZCwgZW5kIGxpbmVcbiAgICAgIGlmIChjb250ZXh0Lm1lYXN1cmVUZXh0KHVwZGF0ZWRMaW5lKS53aWR0aCA+PSB3aWR0aCkge1xuICAgICAgICBvdXRwdXQucHVzaCh1cGRhdGVkTGluZSk7XG4gICAgICAgIGN1cnJlbnRMaW5lID0gJyc7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBmaW5hbCB3b3JkLCBlbmQgbGluZVxuICAgICAgaWYgKHdvcmRzLmxlbmd0aCAtIDEgPT09IGkpIHtcbiAgICAgICAgb3V0cHV0LnB1c2godXBkYXRlZExpbmUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbm8gZXhpdCBjb25kaXRpb24sIHN0b3JlIG5ldyBsaW5lXG4gICAgICBjdXJyZW50TGluZSA9IHVwZGF0ZWRMaW5lLnRyaW0oKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NlbmUsIHR5cGUgU2NlbmVHbG9iYWxzQmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IEdBTUVfTUFQIH0gZnJvbSAnLi9tYXBzL2dhbWUubWFwJztcbmltcG9ydCB7IHR5cGUgQ2xpZW50IH0gZnJvbSAnQGNvcmUvY2xpZW50JztcblxuaW50ZXJmYWNlIEdsb2JhbHMgZXh0ZW5kcyBTY2VuZUdsb2JhbHNCYXNlQ29uZmlnIHtcbiAgc2NvcmU6IG51bWJlcjtcbiAgaGlnaHNjb3JlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBHQU1FX1NDRU5FIGV4dGVuZHMgU2NlbmUge1xuICBtYXBzID0gW1xuICAgIEdBTUVfTUFQXG4gIF07XG5cbiAgZ2xvYmFsczogR2xvYmFscztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY2xpZW50OiBDbGllbnQpIHtcbiAgICBzdXBlcihjbGllbnQpO1xuXG4gICAgdGhpcy5nbG9iYWxzLnNjb3JlID0gNTA7XG4gICAgdGhpcy5nbG9iYWxzLmhpZ2hzY29yZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaWdoc2NvcmUnKSA9PT0gbnVsbCA/IDAgOiBOdW1iZXIobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZ2hzY29yZScpKTtcblxuICAgIHRoaXMuY2hhbmdlTWFwKDApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyB0eXBlIEJhY2tncm91bmRMYXllciB9IGZyb20gJ0Bjb3JlL21vZGVsL2JhY2tncm91bmQtbGF5ZXInO1xuaW1wb3J0IHsgU2NlbmVNYXAgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1tYXAnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZU9iamVjdCB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIEdBTUVfU0NFTkUgfSBmcm9tICcuLi9nYW1lLnNjZW5lJztcbmltcG9ydCB7IFNwcml0ZU9iamVjdCB9IGZyb20gJ0Bjb3JlL29iamVjdHMvc3ByaXRlLm9iamVjdCc7XG5pbXBvcnQgeyBQbGF5ZXJPYmplY3QgfSBmcm9tICcuL2dhbWUvb2JqZWN0cy9wbGF5ZXIub2JqZWN0JztcbmltcG9ydCB7IFNjb3JlT2JqZWN0IH0gZnJvbSAnLi9nYW1lL29iamVjdHMvc2NvcmUub2JqZWN0JztcbmltcG9ydCB7IEZsb29yT2JqZWN0IH0gZnJvbSAnLi9nYW1lL29iamVjdHMvZmxvb3Iub2JqZWN0JztcbmltcG9ydCB7IENvbnRyb2xsZXJPYmplY3QgfSBmcm9tICcuL2dhbWUvb2JqZWN0cy9jb250cm9sbGVyLm9iamVjdCc7XG5cbmNvbnN0IE1BUF9IRUlHSFQ6IG51bWJlciA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQ7XG5jb25zdCBNQVBfV0lEVEg6IG51bWJlciA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSDtcblxuZXhwb3J0IGNsYXNzIEdBTUVfTUFQIGV4dGVuZHMgU2NlbmVNYXAge1xuICBoZWlnaHQgPSBNQVBfSEVJR0hUO1xuICB3aWR0aCA9IE1BUF9XSURUSDtcblxuICBiYWNrZ3JvdW5kTGF5ZXJzOiBCYWNrZ3JvdW5kTGF5ZXJbXSA9IFtcblxuICBdO1xuXG4gIG9iamVjdHM6IFNjZW5lT2JqZWN0W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IEdBTUVfU0NFTkUpIHtcbiAgICBzdXBlcihzY2VuZSk7XG5cbiAgICAvLyBTcHJpdGUgQmFja2dyb3VuZCAoYXMgb2JqZWN0KVxuICAgIHRoaXMub2JqZWN0cy5wdXNoKG5ldyBTcHJpdGVPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgcG9zaXRpb25YOiAwLFxuICAgICAgcG9zaXRpb25ZOiAwLFxuICAgICAgd2lkdGg6IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCxcbiAgICAgIGhlaWdodDogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCxcbiAgICAgIHRpbGVzZXQ6ICdzcHJpdGVzJyxcbiAgICAgIHNwcml0ZVk6IDAsXG4gICAgICBzcHJpdGVYOiAwLFxuICAgIH0pKTtcblxuICAgIC8vIFBsYXllclxuICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyT2JqZWN0KHRoaXMuc2NlbmUsIHt9KTtcbiAgICB0aGlzLm9iamVjdHMucHVzaChwbGF5ZXIpO1xuXG4gICAgdGhpcy5vYmplY3RzLnB1c2gobmV3IENvbnRyb2xsZXJPYmplY3QodGhpcy5zY2VuZSwgeyBwbGF5ZXIsIH0pKTtcblxuICAgIHRoaXMub2JqZWN0cy5wdXNoKG5ldyBTY29yZU9iamVjdCh0aGlzLnNjZW5lLCB7fSkpO1xuICAgIHRoaXMub2JqZWN0cy5wdXNoKG5ldyBGbG9vck9iamVjdCh0aGlzLnNjZW5lLCB7IHBsYXllciwgfSkpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgREVGQVVMVF9QSVBFX1NQRUVEOiBudW1iZXIgPSA0O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUExBWUVSX0dSQVZJVFk6IG51bWJlciA9IDQ4O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUExBWUVSX0FDQ0VMRVJBVElPTjogbnVtYmVyID0gLTEyO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUElQRV9HQVA6IG51bWJlciA9IDM7IC8vIGdhcCBiZXR3ZWVuIHBpcGVzXG5leHBvcnQgY29uc3QgREVGQVVMVF9QSVBFX1JFR0lPTjogbnVtYmVyID0gODsgLy8gb25seSBldmVyIG1vdmUgd2l0aGluIFggdGlsZXNcbiIsImV4cG9ydCBlbnVtIEdhbWVFdmVudHMge1xuICBHYW1lSWRsZSA9ICdHYW1lSWRsZScsXG4gIEdhbWVTdGFydCA9ICdHYW1lU3RhcnQnLFxuICBHYW1lRW5kID0gJ0dhbWVFbmQnXG59XG4iLCJleHBvcnQgY29uc3QgQlJPTlpFX01FREFMX1RIUkVTSE9MRCA9IDEwO1xuZXhwb3J0IGNvbnN0IFNJTFZFUl9NRURBTF9USFJFU0hPTEQgPSAyMDtcbmV4cG9ydCBjb25zdCBHT0xEX01FREFMX1RIUkVTSE9MRCA9IDMwO1xuZXhwb3J0IGNvbnN0IFBMQVRJTlVNX01FREFMX1RIUkVTSE9MRCA9IDQwO1xuXG5leHBvcnQgdHlwZSBNZWRhbFR5cGUgPSAncGxhdGludW0nIHwgJ2dvbGQnIHwgJ3NpbHZlcicgfCAnYnJvbnplJyB8ICdub25lJztcbiIsImV4cG9ydCBjb25zdCBOVU1CRVJfU1BSSVRFU19NRURJVU06IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gIFsnMCddOiB7IHNwcml0ZVg6IDguNSwgc3ByaXRlWTogMTksIH0sXG4gIFsnMSddOiB7IHNwcml0ZVg6IDguNTYyNSwgc3ByaXRlWTogMjkuNjg3NSwgfSxcbiAgWycyJ106IHsgc3ByaXRlWDogOC41LCBzcHJpdGVZOiAzMC40Mzc1LCB9LFxuICBbJzMnXTogeyBzcHJpdGVYOiA4LjEyNSwgc3ByaXRlWTogMzEuMTg3NSwgfSxcbiAgWyc0J106IHsgc3ByaXRlWDogMzEuMzc1LCBzcHJpdGVZOiAtMC4xMjUsIH0sXG4gIFsnNSddOiB7IHNwcml0ZVg6IDMxLjM3NSwgc3ByaXRlWTogMC42MjUsIH0sXG4gIFsnNiddOiB7IHNwcml0ZVg6IDMxLjUsIHNwcml0ZVk6IDEuNSwgfSxcbiAgWyc3J106IHsgc3ByaXRlWDogMzEuNSwgc3ByaXRlWTogMi41LCB9LFxuICBbJzgnXTogeyBzcHJpdGVYOiAxOC4yNSwgc3ByaXRlWTogMTUsIH0sXG4gIFsnOSddOiB7IHNwcml0ZVg6IDE5LjM3NSwgc3ByaXRlWTogMTIuNzUsIH0sXG59O1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1NQUklURVNfTEFSR0U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gIFsnMCddOiB7IHNwcml0ZVg6IDMwLjg3NSwgc3ByaXRlWTogMy43NSwgfSxcbiAgWycxJ106IHsgc3ByaXRlWDogOC4zNSwgc3ByaXRlWTogMjguNDUsIH0sXG4gIFsnMiddOiB7IHNwcml0ZVg6IDE4LjEyNSwgc3ByaXRlWTogMTAsIH0sXG4gIFsnMyddOiB7IHNwcml0ZVg6IDE5LCBzcHJpdGVZOiAxMCwgfSxcbiAgWyc0J106IHsgc3ByaXRlWDogMTkuODc1LCBzcHJpdGVZOiAxMCwgfSxcbiAgWyc1J106IHsgc3ByaXRlWDogMjAuNzUsIHNwcml0ZVk6IDEwLCB9LFxuICBbJzYnXTogeyBzcHJpdGVYOiAxOC4xMjUsIHNwcml0ZVk6IDExLjUsIH0sXG4gIFsnNyddOiB7IHNwcml0ZVg6IDE5LCBzcHJpdGVZOiAxMS41LCB9LFxuICBbJzgnXTogeyBzcHJpdGVYOiAxOS44NzUsIHNwcml0ZVk6IDExLjUsIH0sXG4gIFsnOSddOiB7IHNwcml0ZVg6IDIwLjc1LCBzcHJpdGVZOiAxMS41LCB9LFxufTtcbiIsImltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBHYW1lRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMnO1xuaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgSW50ZXJ2YWxPYmplY3QgfSBmcm9tICdAY29yZS9vYmplY3RzL2ludGVydmFsLm9iamVjdCc7XG5pbXBvcnQgeyBNYXRoVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9tYXRoLnV0aWxzJztcbmltcG9ydCB7IFBpcGVPYmplY3QgfSBmcm9tICcuL3BpcGUub2JqZWN0JztcbmltcG9ydCB7IFBvaW50T2JqZWN0IH0gZnJvbSAnLi9wb2ludC5vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBQbGF5ZXJPYmplY3QgfSBmcm9tICcuL3BsYXllci5vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgU3ByaXRlT2JqZWN0IH0gZnJvbSAnQGNvcmUvb2JqZWN0cy9zcHJpdGUub2JqZWN0JztcbmltcG9ydCB7IFNjb3JlQ2FyZE9iamVjdCB9IGZyb20gJy4vc2NvcmUtY2FyZC5vYmplY3QnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVBFX0dBUCwgREVGQVVMVF9QSVBFX1JFR0lPTiB9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0cy5jb25zdGFudHMnO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG59XG5cbnR5cGUgc3RhdGUgPSAnaWRsZScgfCAncGxheWluZycgfCAnZ2FtZS1vdmVyJztcblxuZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIHN0YXRlOiBzdGF0ZTtcblxuICBwbGF5ZXI6IFBsYXllck9iamVjdDtcblxuICAvLyBvYmplY3QgcmVmZXJlbmNlc1xuICBpbnRlcnZhbDogSW50ZXJ2YWxPYmplY3Q7XG4gIGlkbGVTcHJpdGU6IFNwcml0ZU9iamVjdDtcbiAgc2NvcmVjYXJkOiBTY29yZUNhcmRPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5ZXIgPSBjb25maWcucGxheWVyO1xuXG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUlkbGUsIHRoaXMub25HYW1lSWRsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lU3RhcnQsIHRoaXMub25HYW1lU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUVuZCwgdGhpcy5vbkdhbWVFbmQuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNjZW5lLmRpc3BhdGNoRXZlbnQoR2FtZUV2ZW50cy5HYW1lSWRsZSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgIHRoaXMudXBkYXRlR2FtZUlkbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnYW1lLW92ZXInOlxuICAgICAgICB0aGlzLnVwZGF0ZUdhbWVFbmQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVJZGxlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAnaWRsZScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFudXBHYW1lRW5kKCk7XG5cbiAgICB0aGlzLnN0YXRlID0gJ2lkbGUnO1xuXG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlID0gMDtcblxuICAgIC8vIHZhbHVlcyBoZXJlIGFyZSBhd2t3YXJkbHkgaGFyZGNvZGVkXG4gICAgbGV0IHNwcml0ZVdpZHRoID0gMy42NzU7XG4gICAgbGV0IHNwcml0ZUhlaWdodCA9IDMuNTtcbiAgICB0aGlzLmlkbGVTcHJpdGUgPSBuZXcgU3ByaXRlT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgIHBvc2l0aW9uWDogKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCAvIDIpIC0gKHNwcml0ZVdpZHRoIC8gMikgKyAwLjA1LFxuICAgICAgcG9zaXRpb25ZOiAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAvIDIpIC0gMC44LFxuICAgICAgd2lkdGg6IHNwcml0ZVdpZHRoLFxuICAgICAgaGVpZ2h0OiBzcHJpdGVIZWlnaHQsXG4gICAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgICBzcHJpdGVYOiAxOC4yNSxcbiAgICAgIHNwcml0ZVk6IDUuMjUsXG4gICAgICByZW5kZXJMYXllcjogQ2FudmFzQ29uc3RhbnRzLlVJX0NPTExJU0lPTl9MQVlFUixcbiAgICB9KTtcbiAgICB0aGlzLnNjZW5lLmFkZE9iamVjdCh0aGlzLmlkbGVTcHJpdGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVTdGFydCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3BsYXlpbmcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSAncGxheWluZyc7XG5cbiAgICBpZiAodGhpcy5pZGxlU3ByaXRlKSB7XG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdEJ5SWQodGhpcy5pZGxlU3ByaXRlLmlkKTtcbiAgICB9XG5cbiAgICB0aGlzLmludGVydmFsID0gbmV3IEludGVydmFsT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgIGR1cmF0aW9uOiAyLFxuICAgICAgb25JbnRlcnZhbDogKCkgPT4ge1xuICAgICAgICBsZXQgcmVnaW9uID0gREVGQVVMVF9QSVBFX1JFR0lPTjtcbiAgICAgICAgbGV0IGdhcCA9IERFRkFVTFRfUElQRV9HQVA7XG4gICAgICAgIGxldCBtaW4gPSAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAvIDIpIC0gKHJlZ2lvbiAvIDIpO1xuICAgICAgICBsZXQgbWF4ID0gbWluICsgKHJlZ2lvbiAvIDIpO1xuXG4gICAgICAgIGxldCBoZWlnaHQgPSBNYXRoVXRpbHMucmFuZG9tTnVtYmVyRnJvbVJhbmdlKG1pbiwgbWF4KTtcblxuICAgICAgICAvLyBQaXBlc1xuICAgICAgICB0aGlzLnNjZW5lLmFkZE9iamVjdChuZXcgUGlwZU9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICAgICAgcGxheWVyOiB0aGlzLnBsYXllcixcbiAgICAgICAgICB0eXBlOiAndG9wJyxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLnNjZW5lLmFkZE9iamVjdChuZXcgUGlwZU9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICAgICAgcGxheWVyOiB0aGlzLnBsYXllcixcbiAgICAgICAgICB0eXBlOiAnYm90dG9tJyxcbiAgICAgICAgICBoZWlnaHQ6IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQgLSBoZWlnaHQgLSBnYXAsXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyBwb2ludFxuICAgICAgICB0aGlzLnNjZW5lLmFkZE9iamVjdChuZXcgUG9pbnRPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgICAgIHBsYXllcjogdGhpcy5wbGF5ZXIsXG4gICAgICAgIH0pKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5zY2VuZS5hZGRPYmplY3QodGhpcy5pbnRlcnZhbCk7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZUVuZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ2dhbWUtb3ZlcicpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9ICdnYW1lLW92ZXInO1xuXG4gICAgLy8gVE9ETyhzbWcpOiBtb3ZlIGNsZWFudXAgb2YgcHJldmlvdXMgc3RhdGUgdG8gaXQncyBvd24gZnVuY3Rpb25cbiAgICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3RCeUlkKHRoaXMuaW50ZXJ2YWwuaWQpO1xuICAgIH1cblxuICAgIC8vIHNjb3JlY2FyZFxuICAgIHRoaXMuc2NvcmVjYXJkID0gbmV3IFNjb3JlQ2FyZE9iamVjdCh0aGlzLnNjZW5lLCB7fSk7XG4gICAgdGhpcy5zY2VuZS5hZGRPYmplY3QodGhpcy5zY29yZWNhcmQpO1xuXG4gICAgLy8gc2V0IGhpZ2hzY29yZVxuICAgIGlmICh0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUgPiB0aGlzLnNjZW5lLmdsb2JhbHMuaGlnaHNjb3JlKSB7XG4gICAgICB0aGlzLnNjZW5lLmdsb2JhbHMuaGlnaHNjb3JlID0gdGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2hpZ2hzY29yZScsIHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZS50b1N0cmluZygpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsZWFudXBHYW1lRW5kKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNjb3JlY2FyZCkge1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3RCeUlkKHRoaXMuc2NvcmVjYXJkLmlkKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVHYW1lRW5kKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gJiYgIXRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gPSBmYWxzZTtcbiAgICB0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZUlkbGUpO1xuICB9XG5cbiAgdXBkYXRlR2FtZUlkbGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNjZW5lLmdsb2JhbHMua2V5Ym9hcmRbJyAnXSAmJiAhdGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNjZW5lLmdsb2JhbHMua2V5Ym9hcmRbJyAnXSA9IGZhbHNlO1xuICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gZmFsc2U7XG5cbiAgICB0aGlzLnNjZW5lLmRpc3BhdGNoRXZlbnQoR2FtZUV2ZW50cy5HYW1lU3RhcnQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyB0eXBlIFNjZW5lIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IHR5cGUgUGxheWVyT2JqZWN0IH0gZnJvbSAnLi9wbGF5ZXIub2JqZWN0JztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IEdhbWVFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMvZXZlbnRzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBERUZBVUxUX1BJUEVfU1BFRUQgfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzJztcblxuY29uc3QgREVGQVVMVF9SRU5ERVJfTEFZRVIgPSAxMDtcbmNvbnN0IFNFR01FTlRfV0lEVEggPSAyLjI1OyAvLyB3aWR0aCBvZiB0aGUgZmxvb3Igc2VnbWVudFxuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG59XG5cbmV4cG9ydCBjbGFzcyBGbG9vck9iamVjdCBleHRlbmRzIFNjZW5lT2JqZWN0IHtcbiAgaXNSZW5kZXJhYmxlID0gdHJ1ZTtcbiAgcmVuZGVyTGF5ZXIgPSBERUZBVUxUX1JFTkRFUl9MQVlFUjtcblxuICBvZmZzZXQ6IG51bWJlciA9IDA7XG5cbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG5cbiAgY2hlY2tDb2xsaXNpb246IGJvb2xlYW4gPSB0cnVlO1xuICBtb3ZpbmdGbG9vcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogU2NlbmUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc2NlbmUsIGNvbmZpZyk7XG5cbiAgICAvLyBjb25maWdcbiAgICB0aGlzLnBsYXllciA9IGNvbmZpZy5wbGF5ZXI7XG5cbiAgICAvLyBzZXR1cFxuICAgIHRoaXMuaGVpZ2h0ID0gMjtcbiAgICB0aGlzLndpZHRoID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIO1xuICAgIHRoaXMucG9zaXRpb25YID0gMDtcbiAgICB0aGlzLnBvc2l0aW9uWSA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQgLSB0aGlzLmhlaWdodDtcblxuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVTdGFydCwgdGhpcy5vbkdhbWVTdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lRW5kLCB0aGlzLm9uR2FtZU92ZXIuYmluZCh0aGlzKSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoZWNrSWZQbGF5ZXJBYm92ZUdyb3VuZChkZWx0YSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW92aW5nRmxvb3IpIHtcbiAgICAgIHRoaXMub2Zmc2V0ICs9IGRlbHRhICogREVGQVVMVF9QSVBFX1NQRUVEO1xuICAgICAgdGhpcy5vZmZzZXQgJT0gU0VHTUVOVF9XSURUSDtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJGbG9vcihjb250ZXh0KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ2hlY2tJZlBsYXllckFib3ZlR3JvdW5kKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wbGF5ZXIucG9zaXRpb25ZICsgdGhpcy5wbGF5ZXIuaGVpZ2h0IDwgdGhpcy5wb3NpdGlvblkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNjZW5lLmRpc3BhdGNoRXZlbnQoR2FtZUV2ZW50cy5HYW1lRW5kKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRmxvb3IoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggKyBTRUdNRU5UX1dJRFRIOyBpICs9IFNFR01FTlRfV0lEVEgpIHtcbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzLnNwcml0ZXMsXG4gICAgICAgIDE5LFxuICAgICAgICAwLFxuICAgICAgICB0aGlzLnBvc2l0aW9uWCArIGkgLSB0aGlzLm9mZnNldCxcbiAgICAgICAgdGhpcy5wb3NpdGlvblksXG4gICAgICAgIFNFR01FTlRfV0lEVEgsXG4gICAgICAgIHRoaXMuaGVpZ2h0XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja0NvbGxpc2lvbiA9IHRydWU7XG4gICAgdGhpcy5tb3ZpbmdGbG9vciA9IHRydWU7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZU92ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja0NvbGxpc2lvbiA9IGZhbHNlO1xuICAgIHRoaXMubW92aW5nRmxvb3IgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IHR5cGUgUGxheWVyT2JqZWN0IH0gZnJvbSAnLi9wbGF5ZXIub2JqZWN0JztcbmltcG9ydCB7IHR5cGUgR0FNRV9TQ0VORSB9IGZyb20gJ0BmbGFwcHktYmlyZC9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lJztcbmltcG9ydCB7IERFRkFVTFRfUElQRV9TUEVFRCB9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0cy5jb25zdGFudHMnO1xuaW1wb3J0IHsgR2FtZUV2ZW50cyB9IGZyb20gJy4uL2NvbnN0YW50cy9ldmVudHMuY29uc3RhbnRzJztcblxuY29uc3QgU1BSSVRFUyA9IHtcbiAgVG9wRXhpdDoge1xuICAgIHdpZHRoOiAxLjYyNSxcbiAgICBoZWlnaHQ6IDAuODEyNSxcbiAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgc3ByaXRlWDogNS4yNSxcbiAgICBzcHJpdGVZOiAyMC4xODc1LFxuICB9LFxuICBQaXBlOiB7XG4gICAgd2lkdGg6IDEuNjI1LFxuICAgIGhlaWdodDogMC44MTI1LFxuICAgIHRpbGVzZXQ6ICdzcHJpdGVzJyxcbiAgICBzcHJpdGVYOiA1LjI1LFxuICAgIHNwcml0ZVk6IDI5LjM3NSxcbiAgfSxcbiAgQm90dG9tRXhpdDoge1xuICAgIHdpZHRoOiAxLjYyNSxcbiAgICBoZWlnaHQ6IDAuODEyNSxcbiAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgc3ByaXRlWDogMy41LFxuICAgIHNwcml0ZVk6IDI5LjM3NSxcbiAgfSxcbn07XG5cbnR5cGUgUGlwZVR5cGUgPSAndG9wJyB8ICdib3R0b20nO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG4gIHR5cGU6IFBpcGVUeXBlO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG5cbiAgd2lkdGggPSAxLjYyNTtcbiAgdHlwZTogUGlwZVR5cGU7XG5cbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG5cbiAgY2FuTW92ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5ZXIgPSBjb25maWcucGxheWVyO1xuICAgIHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuICAgIHRoaXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcblxuICAgIHRoaXMucG9zaXRpb25ZID0gdGhpcy50eXBlID09PSAndG9wJyA/IDAgOiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC0gdGhpcy5oZWlnaHQ7XG4gICAgdGhpcy5wb3NpdGlvblggPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggKyAxO1xuXG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUlkbGUsIHRoaXMub25HYW1lSWRsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lRW5kLCB0aGlzLm9uR2FtZUVuZC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHVwZGF0ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbihkZWx0YSk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbGxpZGluZ1dpdGhQbGF5ZXIoZGVsdGEpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgdGhpcy5yZW5kZXJUb3BQaXBlKGNvbnRleHQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHRoaXMucmVuZGVyQm90dG9tUGlwZShjb250ZXh0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb3NpdGlvbihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gbW92ZSBmcm9tIGxlZnQgb2Ygc2NyZWVuIHRvIHRoZSByaWdodFxuICAgIHRoaXMucG9zaXRpb25YIC09IChERUZBVUxUX1BJUEVfU1BFRUQgKiBkZWx0YSk7XG5cbiAgICAvLyB3aGVuIG9mZiBzY3JlZW4sIHJlbW92ZSBwaXBlXG4gICAgaWYgKHRoaXMucG9zaXRpb25YIDwgLTMpIHtcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ29sbGlkaW5nV2l0aFBsYXllcihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gaWYgcGxheWVyIGNvbGxpZGVzIHdpdGggcGlwZVxuICAgIGlmICh0aGlzLmlzQ29sbGlkaW5nV2l0aCh0aGlzLnBsYXllcikpIHtcbiAgICAgIHRoaXMuc2NlbmUuZGlzcGF0Y2hFdmVudChHYW1lRXZlbnRzLkdhbWVFbmQpO1xuICAgIH1cblxuICAgIC8vIGlmIHBsYXllciBpcyBvZmYgdG9wIG9mIHNjcmVlbiBwYXNzZXMgb3ZlciBwaXBlXG4gICAgaWYgKHRoaXMucGxheWVyLnBvc2l0aW9uWSA8IDAgJiYgdGhpcy5pc1dpdGhpbkhvcml6b250YWxCb3VuZHModGhpcy5wbGF5ZXIpKSB7XG4gICAgICB0aGlzLnNjZW5lLmRpc3BhdGNoRXZlbnQoR2FtZUV2ZW50cy5HYW1lRW5kKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclRvcFBpcGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgLy8gcmVwZWF0IHBpcGUgdW50aWwgb2ZmIHNjcmVlblxuICAgIGZvciAobGV0IGkgPSB0aGlzLmhlaWdodCAtIFNQUklURVMuQm90dG9tRXhpdC5oZWlnaHQ7IGkgPj0gLTM7IGkgLT0gU1BSSVRFUy5QaXBlLmhlaWdodCkge1xuICAgICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbJ3Nwcml0ZXMnXSxcbiAgICAgICAgU1BSSVRFUy5QaXBlLnNwcml0ZVgsXG4gICAgICAgIFNQUklURVMuUGlwZS5zcHJpdGVZLFxuICAgICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgICAgdGhpcy5wb3NpdGlvblkgKyBpLFxuICAgICAgICBTUFJJVEVTLlBpcGUud2lkdGgsXG4gICAgICAgIFNQUklURVMuUGlwZS5oZWlnaHRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgY29udGV4dCxcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1snc3ByaXRlcyddLFxuICAgICAgU1BSSVRFUy5Cb3R0b21FeGl0LnNwcml0ZVgsXG4gICAgICBTUFJJVEVTLkJvdHRvbUV4aXQuc3ByaXRlWSxcbiAgICAgIHRoaXMucG9zaXRpb25YLFxuICAgICAgdGhpcy5wb3NpdGlvblkgKyB0aGlzLmhlaWdodCAtIFNQUklURVMuQm90dG9tRXhpdC5oZWlnaHQsXG4gICAgICBTUFJJVEVTLkJvdHRvbUV4aXQud2lkdGgsXG4gICAgICBTUFJJVEVTLkJvdHRvbUV4aXQuaGVpZ2h0XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQm90dG9tUGlwZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICBjb250ZXh0LFxuICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzWydzcHJpdGVzJ10sXG4gICAgICBTUFJJVEVTLlRvcEV4aXQuc3ByaXRlWCxcbiAgICAgIFNQUklURVMuVG9wRXhpdC5zcHJpdGVZLFxuICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICB0aGlzLnBvc2l0aW9uWSxcbiAgICAgIFNQUklURVMuVG9wRXhpdC53aWR0aCxcbiAgICAgIFNQUklURVMuVG9wRXhpdC5oZWlnaHRcbiAgICApO1xuXG4gICAgLy8gcmVwZWF0IHBpcGUgdW50aWwgb2ZmIHNjcmVlblxuICAgIGZvciAobGV0IGkgPSBTUFJJVEVTLlRvcEV4aXQuaGVpZ2h0OyBpIDwgdGhpcy5oZWlnaHQ7IGkgKz0gU1BSSVRFUy5QaXBlLmhlaWdodCkge1xuICAgICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbJ3Nwcml0ZXMnXSxcbiAgICAgICAgU1BSSVRFUy5QaXBlLnNwcml0ZVgsXG4gICAgICAgIFNQUklURVMuUGlwZS5zcHJpdGVZLFxuICAgICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgICAgdGhpcy5wb3NpdGlvblkgKyBpLFxuICAgICAgICBTUFJJVEVTLlBpcGUud2lkdGgsXG4gICAgICAgIFNQUklURVMuUGlwZS5oZWlnaHRcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVJZGxlKCk6IHZvaWQge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0QnlJZCh0aGlzLmlkKTtcbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lRW5kKCk6IHZvaWQge1xuICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgU3ByaXRlQW5pbWF0aW9uIH0gZnJvbSAnQGNvcmUvbW9kZWwvc3ByaXRlLWFuaW1hdGlvbic7XG5pbXBvcnQgeyB0eXBlIEdBTUVfU0NFTkUgfSBmcm9tICdAZmxhcHB5LWJpcmQvc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyBERUZBVUxUX1BMQVlFUl9HUkFWSVRZLCBERUZBVUxUX1BMQVlFUl9BQ0NFTEVSQVRJT04gfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzJztcbmltcG9ydCB7IEdhbWVFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMvZXZlbnRzLmNvbnN0YW50cyc7XG5cbmNvbnN0IERFRkFVTFRfQU5JTUFUSU9OUzogUmVjb3JkPHN0cmluZywgU3ByaXRlQW5pbWF0aW9uPiA9IHtcbiAgZGVmYXVsdDogbmV3IFNwcml0ZUFuaW1hdGlvbignc3ByaXRlcycsIFtcbiAgICB7IHNwcml0ZVg6IDAuMTg3NSwgc3ByaXRlWTogMzAuNjg3NSwgZHVyYXRpb246IDAuMDYyNSwgfSwgLy8gMFxuICAgIHsgc3ByaXRlWDogMS45Mzc1LCBzcHJpdGVZOiAzMC42ODc1LCBkdXJhdGlvbjogMC4wNjI1LCB9LCAvLyAxXG4gICAgeyBzcHJpdGVYOiAzLjY4NzUsIHNwcml0ZVk6IDMwLjY4NzUsIGR1cmF0aW9uOiAwLjA2MjUsIH0sIC8vIDJcbiAgICB7IHNwcml0ZVg6IDEuOTM3NSwgc3ByaXRlWTogMzAuNjg3NSwgZHVyYXRpb246IDAuMDYyNSwgfSAvLyAxXG4gIF0pLFxufTtcblxudHlwZSBzdGF0ZSA9ICdpZGxlJyB8ICdwbGF5aW5nJyB8ICdnYW1lLW92ZXInO1xuXG5jb25zdCBERUZBVUxUX1JFTkRFUl9MQVlFUjogbnVtYmVyID0gMTI7XG5cbmludGVyZmFjZSBDb25maWcgZXh0ZW5kcyBTY2VuZU9iamVjdEJhc2VDb25maWcge1xuXG59XG5cbmV4cG9ydCBjbGFzcyBQbGF5ZXJPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG4gIHJlbmRlckxheWVyID0gREVGQVVMVF9SRU5ERVJfTEFZRVI7XG5cbiAgd2lkdGggPSAxLjA2MjU7IC8vIDE3cHhcbiAgaGVpZ2h0ID0gMC43NTsgLy8gMTJweFxuXG4gIHN0YXRlOiBzdGF0ZTtcblxuICAvLyBtb3ZlbWVudFxuICBzcGVlZDogbnVtYmVyID0gMDtcblxuICAvLyBhbmltYXRpb25zXG4gIGFuaW1hdGlvbkVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBhbmltYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBTcHJpdGVBbmltYXRpb24+O1xuICBhbmltYXRpb24gPSB7XG4gICAgaW5kZXg6IDAsXG4gICAgdGltZXI6IDAsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy5wb3NpdGlvblggPSB0aGlzLnN0YXJ0aW5nWDtcbiAgICB0aGlzLnBvc2l0aW9uWSA9IHRoaXMuc3RhcnRpbmdZO1xuXG4gICAgdGhpcy5hbmltYXRpb25zID0gREVGQVVMVF9BTklNQVRJT05TO1xuXG4gICAgdGhpcy5zdGF0ZSA9ICdwbGF5aW5nJztcblxuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVJZGxlLCB0aGlzLm9uR2FtZUlkbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZVN0YXJ0LCB0aGlzLm9uR2FtZVN0YXJ0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVFbmQsIHRoaXMub25HYW1lT3Zlci5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHVwZGF0ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICBjYXNlICdpZGxlJzpcbiAgICAgICAgLy8gdGhpcy51cGRhdGVQbGF5aW5nKGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwbGF5aW5nJzpcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5aW5nKGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnYW1lLW92ZXInOlxuICAgICAgICB0aGlzLnVwZGF0ZUdhbWVPdmVyKGRlbHRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQbGF5aW5nKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZUdyYXZpdHkoZGVsdGEpO1xuICAgIHRoaXMudXBkYXRlRmxhcChkZWx0YSk7XG4gICAgdGhpcy5wb3NpdGlvblkgKz0gKHRoaXMuc3BlZWQgKiBkZWx0YSk7XG4gICAgdGhpcy51cGRhdGVBbmltYXRpb25UaW1lcihkZWx0YSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUdhbWVPdmVyKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBmYWxsIHRvd2FyZHMgZ3JvdW5kIGlmIG5vdCBhdCBncm91bmRcbiAgICBpZiAodGhpcy5wb3NpdGlvblkgPiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC0gMykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3BlZWQgKz0gKERFRkFVTFRfUExBWUVSX0dSQVZJVFkgKiBkZWx0YSk7XG4gICAgdGhpcy5wb3NpdGlvblkgKz0gKHRoaXMuc3BlZWQgKiBkZWx0YSk7XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJQbGF5ZXIoY29udGV4dCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUdyYXZpdHkoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc3BlZWQgKz0gKERFRkFVTFRfUExBWUVSX0dSQVZJVFkgKiBkZWx0YSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUZsYXAoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgJiYgIXRoaXMuc2NlbmUuZ2xvYmFscy5rZXlib2FyZFsnICddKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSBmYWxzZTtcbiAgICB0aGlzLnNjZW5lLmdsb2JhbHMua2V5Ym9hcmRbJyAnXSA9IGZhbHNlO1xuXG4gICAgLy8gaWYgZmFsbGluZywgcmVzZXQgc3BlZWQgdG8gMFxuICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xuICAgICAgdGhpcy5zcGVlZCA9IDA7XG4gICAgfVxuICAgIHRoaXMuc3BlZWQgKz0gREVGQVVMVF9QTEFZRVJfQUNDRUxFUkFUSU9OO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBbmltYXRpb25UaW1lcihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmFuaW1hdGlvbkVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmFuaW1hdGlvbi50aW1lciA9ICh0aGlzLmFuaW1hdGlvbi50aW1lciArIGRlbHRhKSAlIHRoaXMuYW5pbWF0aW9uc1snZGVmYXVsdCddLmR1cmF0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJQbGF5ZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgbGV0IGFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0aW9uc1snZGVmYXVsdCddO1xuICAgIGxldCBmcmFtZSA9IGFuaW1hdGlvbi5jdXJyZW50RnJhbWUodGhpcy5hbmltYXRpb24udGltZXIpO1xuXG4gICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgY29udGV4dCxcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1thbmltYXRpb24udGlsZXNldF0sXG4gICAgICBmcmFtZS5zcHJpdGVYLFxuICAgICAgZnJhbWUuc3ByaXRlWSxcbiAgICAgIHRoaXMucG9zaXRpb25YLFxuICAgICAgdGhpcy5wb3NpdGlvblksXG4gICAgICB0aGlzLndpZHRoLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAge1xuICAgICAgICBvcGFjaXR5OiB0aGlzLnJlbmRlck9wYWNpdHksXG4gICAgICAgIHNjYWxlOiB0aGlzLnJlbmRlclNjYWxlLFxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZUlkbGUoKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZSA9ICdpZGxlJztcbiAgICB0aGlzLnBvc2l0aW9uWCA9IHRoaXMuc3RhcnRpbmdYO1xuICAgIHRoaXMucG9zaXRpb25ZID0gdGhpcy5zdGFydGluZ1k7XG4gICAgdGhpcy5zcGVlZCA9IDA7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZVN0YXJ0KCk6IHZvaWQge1xuICAgIC8vIHN0YXJ0IHdpdGggcGxheWVyIG1vdmluZyB1cHdhcmRzXG4gICAgdGhpcy5zcGVlZCA9IERFRkFVTFRfUExBWUVSX0FDQ0VMRVJBVElPTjtcbiAgICB0aGlzLnN0YXRlID0gJ3BsYXlpbmcnO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVPdmVyKCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGUgPSAnZ2FtZS1vdmVyJztcbiAgfVxuXG4gIGdldCBzdGFydGluZ1goKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCAvIDIpIC0gKHRoaXMud2lkdGggLyAyKTtcbiAgfVxuXG4gIGdldCBzdGFydGluZ1koKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQgLyAyKSAtICh0aGlzLmhlaWdodCAvIDIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBQbGF5ZXJPYmplY3QgfSBmcm9tICcuL3BsYXllci5vYmplY3QnO1xuaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgR2FtZUV2ZW50cyB9IGZyb20gJy4uL2NvbnN0YW50cy9ldmVudHMuY29uc3RhbnRzJztcbmltcG9ydCB7IERFRkFVTFRfUElQRV9TUEVFRCB9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0cy5jb25zdGFudHMnO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG59XG5cbmV4cG9ydCBjbGFzcyBQb2ludE9iamVjdCBleHRlbmRzIFNjZW5lT2JqZWN0IHtcbiAgaXNSZW5kZXJhYmxlID0gdHJ1ZTtcblxuICBwbGF5ZXI6IFBsYXllck9iamVjdDtcblxuICB3aWR0aDogbnVtYmVyID0gMC4wNjI1O1xuICBoZWlnaHQ6IG51bWJlciA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQ7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5ZXIgPSBjb25maWcucGxheWVyO1xuICAgIHRoaXMucG9zaXRpb25YID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIICsgMi42MjU7XG5cbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lRW5kLCB0aGlzLm9uR2FtZU92ZXIuYmluZCh0aGlzKSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlUG9zaXRpb24oZGVsdGEpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzKGRlbHRhKTtcbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcblxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb3NpdGlvbihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gbW92ZSBmcm9tIGxlZnQgb2Ygc2NyZWVuIHRvIHRoZSByaWdodFxuICAgIHRoaXMucG9zaXRpb25YIC09IChERUZBVUxUX1BJUEVfU1BFRUQgKiBkZWx0YSk7XG5cbiAgICAvLyB3aGVuIG9mZiBzY3JlZW4sIHJlbW92ZSBwaXBlXG4gICAgaWYgKHRoaXMucG9zaXRpb25YIDwgLTMpIHsgLy8gMyBpcyBhcmJpdHJhcnkgaGVyZSwgY291bGQgYmUgYSBiZXR0ZXIgdmFsdWVcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3NpdGlvblggPCB0aGlzLnBsYXllci5wb3NpdGlvblgpIHtcbiAgICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZSsrO1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3QodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVPdmVyKCk6IHZvaWQge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0QnlJZCh0aGlzLmlkKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IHR5cGUgR0FNRV9TQ0VORSB9IGZyb20gJ0BmbGFwcHktYmlyZC9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lJztcbmltcG9ydCB7IFNwcml0ZU9iamVjdCB9IGZyb20gJ0Bjb3JlL29iamVjdHMvc3ByaXRlLm9iamVjdCc7XG5pbXBvcnQgeyBOVU1CRVJfU1BSSVRFU19NRURJVU0gfSBmcm9tICcuLi9jb25zdGFudHMvc3ByaXRlLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyBCUk9OWkVfTUVEQUxfVEhSRVNIT0xELCBHT0xEX01FREFMX1RIUkVTSE9MRCwgdHlwZSBNZWRhbFR5cGUsIFBMQVRJTlVNX01FREFMX1RIUkVTSE9MRCwgU0lMVkVSX01FREFMX1RIUkVTSE9MRCB9IGZyb20gJy4uL2NvbnN0YW50cy9tZWRhbC5jb25zdGFudHMnO1xuXG5jb25zdCBNRURBTF9TUFJJVEVTID0ge1xuICBicm9uemU6IHsgc3ByaXRlWDogNywgc3ByaXRlWTogMjkuNzUsIH0sXG4gIHNpbHZlcjogeyBzcHJpdGVYOiA3LCBzcHJpdGVZOiAyOC4yNSwgfSxcbiAgZ29sZDogeyBzcHJpdGVYOiA3LjUsIHNwcml0ZVk6IDE3LjUsIH0sXG4gIHBsYXRpbnVtOiB7IHNwcml0ZVg6IDcuNSwgc3ByaXRlWTogMTYsIH0sXG59O1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHt9XG5cbmV4cG9ydCBjbGFzcyBTY29yZUNhcmRPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG4gIHJlbmRlckxheWVyID0gQ2FudmFzQ29uc3RhbnRzLlVJX0NPTExJU0lPTl9MQVlFUjtcblxuICAvLyBvYmplY3QgcmVmZXJlbmNlc1xuICBiYWNrZ3JvdW5kOiBTcHJpdGVPYmplY3Q7XG4gIG1lZGFsOiBTcHJpdGVPYmplY3Q7XG4gIGhpZ2hzY29yZTogU3ByaXRlT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIC8vIGJhY2tncm91bmRcbiAgICB0aGlzLmJhY2tncm91bmQgPSB0aGlzLmNyZWF0ZUJhY2tncm91bmQoKTtcbiAgICB0aGlzLnNjZW5lLmFkZE9iamVjdCh0aGlzLmJhY2tncm91bmQpO1xuXG4gICAgLy8gbWVkYWxcbiAgICBpZiAodGhpcy5tZWRhbFR5cGUgIT09ICdub25lJykge1xuICAgICAgdGhpcy5tZWRhbCA9IHRoaXMuY3JlYXRlTWVkYWwodGhpcy5tZWRhbFR5cGUpO1xuICAgICAgdGhpcy5zY2VuZS5hZGRPYmplY3QodGhpcy5tZWRhbCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyU2NvcmUoY29udGV4dCk7XG4gICAgdGhpcy5yZW5kZXJTY29yZUhpZ2hzY29yZShjb250ZXh0KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQmFja2dyb3VuZCgpOiBTcHJpdGVPYmplY3Qge1xuICAgIGxldCBzcHJpdGVXaWR0aCA9IDcuNTtcbiAgICBsZXQgc3ByaXRlSGVpZ2h0ID0gNDtcblxuICAgIHJldHVybiBuZXcgU3ByaXRlT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgIHBvc2l0aW9uWDogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19DRU5URVJfVElMRV9YIC0gKHNwcml0ZVdpZHRoIC8gMiksXG4gICAgICBwb3NpdGlvblk6IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfQ0VOVEVSX1RJTEVfWSAtIChzcHJpdGVIZWlnaHQgLyAyKSxcbiAgICAgIHdpZHRoOiBzcHJpdGVXaWR0aCxcbiAgICAgIGhlaWdodDogc3ByaXRlSGVpZ2h0LFxuICAgICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgICAgc3ByaXRlWDogMCxcbiAgICAgIHNwcml0ZVk6IDE2LFxuICAgICAgcmVuZGVyTGF5ZXI6IENhbnZhc0NvbnN0YW50cy5VSV9DT0xMSVNJT05fTEFZRVIsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU1lZGFsKG1lZGFsOiBNZWRhbFR5cGUpOiBTcHJpdGVPYmplY3Qge1xuICAgIGxldCBzcHJpdGVXaWR0aCA9IDEuNTtcbiAgICBsZXQgc3ByaXRlSGVpZ2h0ID0gMS41O1xuXG4gICAgaWYgKG1lZGFsID09PSAnbm9uZScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNwcml0ZU9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICBwb3NpdGlvblg6IHRoaXMuYmFja2dyb3VuZC5wb3NpdGlvblggKyAxLFxuICAgICAgcG9zaXRpb25ZOiB0aGlzLmJhY2tncm91bmQucG9zaXRpb25ZICsgMS4zNzUsXG4gICAgICB3aWR0aDogc3ByaXRlV2lkdGgsXG4gICAgICBoZWlnaHQ6IHNwcml0ZUhlaWdodCxcbiAgICAgIHRpbGVzZXQ6ICdzcHJpdGVzJyxcbiAgICAgIHNwcml0ZVg6IE1FREFMX1NQUklURVNbbWVkYWxdLnNwcml0ZVgsXG4gICAgICBzcHJpdGVZOiBNRURBTF9TUFJJVEVTW21lZGFsXS5zcHJpdGVZLFxuICAgICAgcmVuZGVyTGF5ZXI6IENhbnZhc0NvbnN0YW50cy5VSV9DT0xMSVNJT05fTEFZRVIsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclNjb3JlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGxldCBzY29yZSA9IHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZS50b1N0cmluZygpLnNwbGl0KCcnKTtcblxuICAgIGxldCBwb3NpdGlvblggPSB0aGlzLmJhY2tncm91bmQucG9zaXRpb25YICsgdGhpcy5iYWNrZ3JvdW5kLndpZHRoIC0gMS41O1xuICAgIGxldCBwb3NpdGlvblkgPSB0aGlzLmJhY2tncm91bmQucG9zaXRpb25ZICsgMS4xMjU7XG5cbiAgICBsZXQgc3ByaXRlV2lkdGggPSAwLjU7XG4gICAgbGV0IHhPZmZzZXQgPSAwLjA2MjU7XG4gICAgbGV0IHNwcml0ZUhlaWdodCA9IDAuNzU7XG5cbiAgICBsZXQgc3RhcnQgPSAoc2NvcmUubGVuZ3RoIC0gMSkgKiAoc3ByaXRlV2lkdGggKyB4T2Zmc2V0KTtcblxuICAgIHNjb3JlLmZvckVhY2goKGRpZ2l0LCBpbmRleCkgPT4ge1xuICAgICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICB0aGlzLmFzc2V0cy5pbWFnZXMuc3ByaXRlcyxcbiAgICAgICAgTlVNQkVSX1NQUklURVNfTUVESVVNW2RpZ2l0XS5zcHJpdGVYLFxuICAgICAgICBOVU1CRVJfU1BSSVRFU19NRURJVU1bZGlnaXRdLnNwcml0ZVksXG4gICAgICAgIChwb3NpdGlvblggLSBzdGFydCkgKyAoKHNwcml0ZVdpZHRoICsgeE9mZnNldCkgKiBpbmRleCksXG4gICAgICAgIHBvc2l0aW9uWSxcbiAgICAgICAgc3ByaXRlV2lkdGgsXG4gICAgICAgIHNwcml0ZUhlaWdodFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU2NvcmVIaWdoc2NvcmUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgbGV0IHNjb3JlID0gdGhpcy5zY2VuZS5nbG9iYWxzLmhpZ2hzY29yZS50b1N0cmluZygpLnNwbGl0KCcnKTtcblxuICAgIGxldCBwb3NpdGlvblggPSB0aGlzLmJhY2tncm91bmQucG9zaXRpb25YICsgdGhpcy5iYWNrZ3JvdW5kLndpZHRoIC0gMS41O1xuICAgIGxldCBwb3NpdGlvblkgPSB0aGlzLmJhY2tncm91bmQucG9zaXRpb25ZICsgMS4xMjU7XG5cbiAgICBsZXQgc3ByaXRlV2lkdGggPSAwLjU7XG4gICAgbGV0IHhPZmZzZXQgPSAwLjA2MjU7XG4gICAgbGV0IHNwcml0ZUhlaWdodCA9IDAuNzU7XG5cbiAgICBsZXQgc3RhcnQgPSAoc2NvcmUubGVuZ3RoIC0gMSkgKiAoc3ByaXRlV2lkdGggKyB4T2Zmc2V0KTtcblxuICAgIHNjb3JlLmZvckVhY2goKGRpZ2l0LCBpbmRleCkgPT4ge1xuICAgICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICB0aGlzLmFzc2V0cy5pbWFnZXMuc3ByaXRlcyxcbiAgICAgICAgTlVNQkVSX1NQUklURVNfTUVESVVNW2RpZ2l0XS5zcHJpdGVYLFxuICAgICAgICBOVU1CRVJfU1BSSVRFU19NRURJVU1bZGlnaXRdLnNwcml0ZVksXG4gICAgICAgIChwb3NpdGlvblggLSBzdGFydCkgKyAoKHNwcml0ZVdpZHRoICsgeE9mZnNldCkgKiBpbmRleCksXG4gICAgICAgIHBvc2l0aW9uWSArIDEuNSxcbiAgICAgICAgc3ByaXRlV2lkdGgsXG4gICAgICAgIHNwcml0ZUhlaWdodFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBtZWRhbFR5cGUoKTogTWVkYWxUeXBlIHtcbiAgICBpZiAodGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlID49IFBMQVRJTlVNX01FREFMX1RIUkVTSE9MRCkge1xuICAgICAgcmV0dXJuICdwbGF0aW51bSc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZSA+PSBHT0xEX01FREFMX1RIUkVTSE9MRCkge1xuICAgICAgcmV0dXJuICdnb2xkJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlID49IFNJTFZFUl9NRURBTF9USFJFU0hPTEQpIHtcbiAgICAgIHJldHVybiAnc2lsdmVyJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlID49IEJST05aRV9NRURBTF9USFJFU0hPTEQpIHtcbiAgICAgIHJldHVybiAnYnJvbnplJztcbiAgICB9XG5cbiAgICByZXR1cm4gJ25vbmUnO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdEJ5SWQodGhpcy5iYWNrZ3JvdW5kLmlkKTtcbiAgICBpZiAodGhpcy5tZWRhbCkge1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3RCeUlkKHRoaXMubWVkYWwuaWQpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IHR5cGUgR0FNRV9TQ0VORSB9IGZyb20gJ0BmbGFwcHktYmlyZC9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lJztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IE5VTUJFUl9TUFJJVEVTX0xBUkdFIH0gZnJvbSAnLi4vY29uc3RhbnRzL3Nwcml0ZS5jb25zdGFudHMnO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHt9XG5cbmV4cG9ydCBjbGFzcyBTY29yZU9iamVjdCBleHRlbmRzIFNjZW5lT2JqZWN0IHtcbiAgaXNSZW5kZXJhYmxlID0gdHJ1ZTtcbiAgcmVuZGVyTGF5ZXIgPSBDYW52YXNDb25zdGFudHMuVUlfQ09MTElTSU9OX0xBWUVSO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBsZXQgc2NvcmUgPSB0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG5cbiAgICBzY29yZS5mb3JFYWNoKChkaWdpdCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBvZmZzZXQgPSBkaWdpdCA9PT0gJzEnID8gMC4xNiA6IDA7IC8vIHRoZSAxIHNwcml0ZSBpbiB0aGUgc2hlZXQgaXMgYSBiaXQgb2ZmIHNvIG1hbnVhbGx5IGFkanVzdGluZyBpdCByYXRoZXIgdGhhbiBhbHRlcmluZyB0aGUgc3ByaXRlIHNoZWV0XG5cbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzLnNwcml0ZXMsXG4gICAgICAgIE5VTUJFUl9TUFJJVEVTX0xBUkdFW2RpZ2l0XS5zcHJpdGVYLFxuICAgICAgICBOVU1CRVJfU1BSSVRFU19MQVJHRVtkaWdpdF0uc3ByaXRlWSxcbiAgICAgICAgKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCAvIDIpIC0gKHNjb3JlLmxlbmd0aCAvIDIpICsgaW5kZXggKyBvZmZzZXQsXG4gICAgICAgIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQgLyA4LFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIDEuMTI1XG4gICAgICApO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyB0eXBlIENsaWVudCB9IGZyb20gJ0Bjb3JlL2NsaWVudCc7XG5pbXBvcnQgeyBTY2VuZSB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IE1BSU5fTUVOVV9NQVAgfSBmcm9tICcuL21hcHMvbWFpbi1tZW51Lm1hcCc7XG5cbmV4cG9ydCBjbGFzcyBNQUlOX01FTlVfU0NFTkUgZXh0ZW5kcyBTY2VuZSB7XG4gIG1hcHMgPSBbXG4gICAgTUFJTl9NRU5VX01BUFxuICBdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjbGllbnQ6IENsaWVudCkge1xuICAgIHN1cGVyKGNsaWVudCk7XG4gICAgdGhpcy5jaGFuZ2VNYXAoMCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgQmFja2dyb3VuZExheWVyIH0gZnJvbSAnQGNvcmUvbW9kZWwvYmFja2dyb3VuZC1sYXllcic7XG5pbXBvcnQgeyBTY2VuZU1hcCB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW1hcCc7XG5pbXBvcnQgeyB0eXBlIFNjZW5lT2JqZWN0IH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IE1BSU5fTUVOVV9CQUNLR1JPVU5EX0xBWUVSXzEgfSBmcm9tICcuL21haW4tbWVudS9iYWNrZ3JvdW5kcy9sYXllci4xJztcbmltcG9ydCB7IFN0YXJ0QnV0dG9uT2JqZWN0IH0gZnJvbSAnLi9tYWluLW1lbnUvb2JqZWN0cy9zdGFydC1idXR0b24ub2JqZWN0JztcbmltcG9ydCB7IHR5cGUgTUFJTl9NRU5VX1NDRU5FIH0gZnJvbSAnLi4vbWFpbi1tZW51LnNjZW5lJztcbmltcG9ydCB7IFNwcml0ZU9iamVjdCB9IGZyb20gJ0Bjb3JlL29iamVjdHMvc3ByaXRlLm9iamVjdCc7XG5cbmNvbnN0IE1BUF9IRUlHSFQ6IG51bWJlciA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQ7XG5jb25zdCBNQVBfV0lEVEg6IG51bWJlciA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSDtcblxuZXhwb3J0IGNsYXNzIE1BSU5fTUVOVV9NQVAgZXh0ZW5kcyBTY2VuZU1hcCB7XG4gIGhlaWdodCA9IE1BUF9IRUlHSFQ7XG4gIHdpZHRoID0gTUFQX1dJRFRIO1xuXG4gIGJhY2tncm91bmRMYXllcnM6IEJhY2tncm91bmRMYXllcltdID0gW1xuICAgIE1BSU5fTUVOVV9CQUNLR1JPVU5EX0xBWUVSXzFcbiAgXTtcblxuICBvYmplY3RzOiBTY2VuZU9iamVjdFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBNQUlOX01FTlVfU0NFTkUpIHtcbiAgICBzdXBlcihzY2VuZSk7XG5cbiAgICB0aGlzLm9iamVjdHMucHVzaChuZXcgU3RhcnRCdXR0b25PYmplY3QodGhpcy5zY2VuZSwge30pKTtcblxuICAgIC8vIGxvZ29cbiAgICBsZXQgbG9nb1dpZHRoID0gNjtcbiAgICBsZXQgbG9nb0hlaWdodCA9IDEuODtcbiAgICB0aGlzLm9iamVjdHMucHVzaChuZXcgU3ByaXRlT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgIHBvc2l0aW9uWDogKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCAvIDIpIC0gKGxvZ29XaWR0aCAvIDIpLFxuICAgICAgcG9zaXRpb25ZOiAzLFxuICAgICAgd2lkdGg6IGxvZ29XaWR0aCxcbiAgICAgIGhlaWdodDogbG9nb0hlaWdodCxcbiAgICAgIHRpbGVzZXQ6ICdzcHJpdGVzJyxcbiAgICAgIHNwcml0ZVg6IDIxLjc1LFxuICAgICAgc3ByaXRlWTogNS41LFxuICAgIH0pKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgdHlwZSBCYWNrZ3JvdW5kTGF5ZXIgfSBmcm9tICdAY29yZS9tb2RlbC9iYWNrZ3JvdW5kLWxheWVyJztcbmltcG9ydCB7IHR5cGUgQmFja2dyb3VuZFRpbGUgfSBmcm9tICdAY29yZS9tb2RlbC9iYWNrZ3JvdW5kLXRpbGUnO1xuXG5jb25zdCBCQVNFX1RJTEU6IEJhY2tncm91bmRUaWxlID0ge1xuICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gIGFuaW1hdGlvbkZyYW1lRHVyYXRpb246IDEsXG4gIGFuaW1hdGlvbkZyYW1lczogW10sXG4gIGFuaW1hdGlvbk1hcDogWzFdLFxufTtcblxuY29uc3QgU0tZOiBCYWNrZ3JvdW5kVGlsZSA9IHtcbiAgLi4uQkFTRV9USUxFLFxuICBhbmltYXRpb25GcmFtZXM6IFtcbiAgICB7IHNwcml0ZVg6IDAsIHNwcml0ZVk6IDAsIH1cbiAgXSxcbn07XG5cbmNvbnN0IENJVFlfVFJBTlNJVElPTjogQmFja2dyb3VuZFRpbGUgPSB7XG4gIC4uLkJBU0VfVElMRSxcbiAgYW5pbWF0aW9uRnJhbWVzOiBbXG4gICAgeyBzcHJpdGVYOiAwLCBzcHJpdGVZOiA5LCB9XG4gIF0sXG59O1xuXG5jb25zdCBDSVRZOiBCYWNrZ3JvdW5kVGlsZSA9IHtcbiAgLi4uQkFTRV9USUxFLFxuICBhbmltYXRpb25GcmFtZXM6IFtcbiAgICB7IHNwcml0ZVg6IDAsIHNwcml0ZVk6IDEwLCB9XG4gIF0sXG59O1xuXG5jb25zdCBHUkFTU19UUkFOU0lUSU9OOiBCYWNrZ3JvdW5kVGlsZSA9IHtcbiAgLi4uQkFTRV9USUxFLFxuICBhbmltYXRpb25GcmFtZXM6IFtcbiAgICB7IHNwcml0ZVg6IDAsIHNwcml0ZVk6IDExLCB9XG4gIF0sXG59O1xuXG5jb25zdCBHUkFTUzogQmFja2dyb3VuZFRpbGUgPSB7XG4gIC4uLkJBU0VfVElMRSxcbiAgYW5pbWF0aW9uRnJhbWVzOiBbXG4gICAgeyBzcHJpdGVYOiAwLCBzcHJpdGVZOiAxNSwgfVxuICBdLFxufTtcblxuY29uc3QgQ09MVU1OOiBCYWNrZ3JvdW5kVGlsZVtdID0gW1xuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIENJVFlfVFJBTlNJVElPTixcbiAgQ0lUWSxcbiAgR1JBU1NfVFJBTlNJVElPTixcbiAgR1JBU1MsXG4gIEdSQVNTLFxuICBHUkFTU1xuXTtcblxuLy8gVE9ETyhzbWcpOiBiYWNrZ3JvdW5kIGlzIDkgdGlsZXMgd2lkZVxuZXhwb3J0IGNvbnN0IE1BSU5fTUVOVV9CQUNLR1JPVU5EX0xBWUVSXzE6IEJhY2tncm91bmRMYXllciA9IHtcbiAgaW5kZXg6IDAsXG4gIHRpbGVzOiBbXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OXG4gIF0sXG59O1xuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZSB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBNb3VzZVV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvbW91c2UudXRpbHMnO1xuaW1wb3J0IHsgR0FNRV9TQ0VORSB9IGZyb20gJ0BmbGFwcHktYmlyZC9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lJztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG5cbn1cblxuZXhwb3J0IGNsYXNzIFN0YXJ0QnV0dG9uT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogU2NlbmUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc2NlbmUsIGNvbmZpZyk7XG5cbiAgICB0aGlzLndpZHRoID0gMy41O1xuICAgIHRoaXMuaGVpZ2h0ID0gMjtcbiAgICB0aGlzLnBvc2l0aW9uWCA9IChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggLyAyKSAtICh0aGlzLndpZHRoIC8gMik7XG4gICAgdGhpcy5wb3NpdGlvblkgPSAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAvIDIpIC0gKHRoaXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IGZhbHNlO1xuXG4gICAgbGV0IGNsaWNrZWQgPSBNb3VzZVV0aWxzLmlzQ2xpY2tXaXRoaW4odGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uWCwgdGhpcy5wb3NpdGlvblksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICBpZiAoIWNsaWNrZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNjZW5lLmNoYW5nZVNjZW5lKEdBTUVfU0NFTkUpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbJ3Nwcml0ZXMnXSxcbiAgICAgIDIyLFxuICAgICAgNy4yNSxcbiAgICAgIHRoaXMucG9zaXRpb25YLFxuICAgICAgdGhpcy5wb3NpdGlvblksXG4gICAgICB0aGlzLndpZHRoLFxuICAgICAgdGhpcy5oZWlnaHRcbiAgICApO1xuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IENsaWVudCB9IGZyb20gJ0Bjb3JlL2NsaWVudCc7XG5pbXBvcnQgeyB0eXBlIEFzc2V0c0NvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL2Fzc2V0cyc7XG5pbXBvcnQgeyB0eXBlIFNjZW5lQ29uc3RydWN0b3JTaWduYXR1cmUgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZSc7XG5pbXBvcnQgeyBNQUlOX01FTlVfU0NFTkUgfSBmcm9tICcuL3NjZW5lcy9tYWluLW1lbnUvbWFpbi1tZW51LnNjZW5lJztcbmltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IEdBTUVfU0NFTkUgfSBmcm9tICcuL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuXG4oZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAgKiBEZWNsYXJlIHlvdXIgY2FudmFzIGNvbnN0YW50cyBoZXJlXG4gICAqL1xuICBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUID0gMTY7XG4gIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCA9IDk7XG4gIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgPSAxNjtcblxuICAvKipcbiAgKiBBZGQgeW91ciBzY2VuZXMgaGVyZSwgdGhlIGZpcnN0IHNjZW5lIHdpbGwgYmUgbG9hZGVkIG9uIHN0YXJ0dXBcbiAgKi9cbiAgY29uc3Qgc2NlbmVzOiBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlW10gPSBbXG4gICAgTUFJTl9NRU5VX1NDRU5FLFxuICAgIEdBTUVfU0NFTkVcbiAgXTtcblxuICBjb25zdCBhc3NldHM6IEFzc2V0c0NvbmZpZyA9IHtcbiAgICBpbWFnZXM6IHtcbiAgICAgIHNwcml0ZXM6ICdhc3NldHMvc3ByaXRlcy5wbmcnLFxuICAgIH0sXG4gICAgYXVkaW86IHt9LFxuICB9O1xuXG4gIHdpbmRvdy5lbmdpbmUgPSBuZXcgQ2xpZW50KFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXItYXJlYScpLFxuICAgIHNjZW5lcyxcbiAgICBhc3NldHNcbiAgKTtcbn0pKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
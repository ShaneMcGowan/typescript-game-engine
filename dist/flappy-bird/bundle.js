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
        _scenes_game_game_scene__WEBPACK_IMPORTED_MODULE_3__.GAME_SCENE,
        _scenes_main_menu_main_menu_scene__WEBPACK_IMPORTED_MODULE_1__.MAIN_MENU_SCENE
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZWJwYWNrOi8vLy4uLy4uL2NvcmUvY2xpZW50LnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uLi8uLi9jb3JlL21vZGVsL3NjZW5lLW1hcC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS9tb2RlbC9zY2VuZS1vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvbW9kZWwvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvbW9kZWwvc3ByaXRlLWFuaW1hdGlvbi50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS9vYmplY3RzL2ludGVydmFsLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS9vYmplY3RzL3Nwcml0ZS5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL2NvcmUvdXRpbHMvbWF0aC51dGlscy50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS91dGlscy9tb3VzZS51dGlscy50cyIsIndlYnBhY2s6Ly8vLi4vLi4vY29yZS91dGlscy9yZW5kZXIudXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZS50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUubWFwLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9jb25zdGFudHMvZXZlbnRzLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvY29uc3RhbnRzL21lZGFsLmNvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvZ2FtZS9tYXBzL2dhbWUvY29uc3RhbnRzL3Nwcml0ZS5jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL29iamVjdHMvY29udHJvbGxlci5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL29iamVjdHMvZmxvb3Iub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9vYmplY3RzL3BpcGUub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9vYmplY3RzL3BsYXllci5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL2dhbWUvbWFwcy9nYW1lL29iamVjdHMvcG9pbnQub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9vYmplY3RzL3Njb3JlLWNhcmQub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NjZW5lcy9nYW1lL21hcHMvZ2FtZS9vYmplY3RzL3Njb3JlLm9iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvbWFpbi1tZW51L21haW4tbWVudS5zY2VuZS50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvbWFpbi1tZW51L21hcHMvbWFpbi1tZW51Lm1hcC50cyIsIndlYnBhY2s6Ly8vLi9zY2VuZXMvbWFpbi1tZW51L21hcHMvbWFpbi1tZW51L2JhY2tncm91bmRzL2xheWVyLjEudHMiLCJ3ZWJwYWNrOi8vLy4vc2NlbmVzL21haW4tbWVudS9tYXBzL21haW4tbWVudS9vYmplY3RzL3N0YXJ0LWJ1dHRvbi5vYmplY3QudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnLi9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyB0eXBlIFNjZW5lQ29uc3RydWN0b3JTaWduYXR1cmUsIHR5cGUgU2NlbmUgfSBmcm9tICcuL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnLi91dGlscy9yZW5kZXIudXRpbHMnO1xuaW1wb3J0IHsgdHlwZSBBc3NldHNDb25maWcsIHR5cGUgQXNzZXRzIH0gZnJvbSAnLi9tb2RlbC9hc3NldHMnO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcbiAgLy8gQ29uc3RhbnRzXG4gIHByaXZhdGUgcmVhZG9ubHkgQ0FOVkFTX0hFSUdIVDogbnVtYmVyID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19IRUlHSFQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgQ0FOVkFTX1dJRFRIOiBudW1iZXIgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1dJRFRIO1xuXG4gIC8vIFVJXG4gIHB1YmxpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICBwdWJsaWMgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwdWJsaWMgZGVsdGE6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgbGFzdFJlbmRlclRpbWVzdGFtcDogbnVtYmVyID0gMDtcblxuICAvLyBEYXRhXG4gIHByaXZhdGUgcmVhZG9ubHkgc2NlbmVzOiBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlW107XG4gIHByaXZhdGUgY3VycmVudFNjZW5lOiBTY2VuZTtcblxuICAvLyBBc3NldHNcbiAgYXNzZXRzOiBBc3NldHMgPSB7XG4gICAgaW1hZ2VzOiB7fSxcbiAgICBhdWRpbzoge30sXG4gIH07XG5cbiAgLy8gRGVidWdcbiAgZGVidWcgPSB7XG4gICAgZW5hYmxlZDogdHJ1ZSwgLy8gaWYgdHJ1ZSwgZGVidWcga2V5cyBhcmUgZW5hYmxlZFxuICAgIHN0YXRzOiB7XG4gICAgICBmcHM6IGZhbHNlLCAvLyBzaG93IGZwc1xuICAgICAgZnBzQ291bnRlcjogMCwgLy8gdGltZSBzaW5jZSBsYXN0IGNoZWNrXG4gICAgICBvYmplY3RDb3VudDogZmFsc2UsIC8vIHNob3cgb2JqZWN0IGNvdW50XG4gICAgfSxcbiAgICBicmVha3BvaW50OiB7XG4gICAgICBmcmFtZTogZmFsc2UsXG4gICAgfSxcbiAgICB0aW1pbmc6IHtcbiAgICAgIGZyYW1lOiBmYWxzZSxcbiAgICAgIGZyYW1lQmFja2dyb3VuZDogZmFsc2UsXG4gICAgICBmcmFtZVVwZGF0ZTogZmFsc2UsXG4gICAgICBmcmFtZVJlbmRlcjogZmFsc2UsXG4gICAgfSxcbiAgICB1aToge1xuICAgICAgZ3JpZDoge1xuICAgICAgICBsaW5lczogZmFsc2UsXG4gICAgICAgIG51bWJlcnM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGNhbnZhc0xheWVyczogZmFsc2UsXG4gICAgfSxcbiAgICBvYmplY3Q6IHtcbiAgICAgIHJlbmRlckJvdW5kYXJ5OiBmYWxzZSxcbiAgICAgIHJlbmRlckJhY2tncm91bmQ6IGZhbHNlLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gY29udHJvbGxlcnNcbiAgZ2FtZXBhZDogR2FtZXBhZCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgY29udGFpbmVyOiBIVE1MRWxlbWVudCxcbiAgICBzY2VuZXM6IFNjZW5lQ29uc3RydWN0b3JTaWduYXR1cmVbXSxcbiAgICBhc3NldHM6IEFzc2V0c0NvbmZpZ1xuICApIHtcbiAgICAvLyBzY2VuZXNcbiAgICB0aGlzLnNjZW5lcyA9IFsuLi5zY2VuZXNdO1xuXG4gICAgLy8gbG9hZCBhc3NldHNcbiAgICAvLyBUT0RPKHNtZyk6IHNvbWUgc29ydCBvZiBsb2FkaW5nIHNjcmVlbiAvIHJlbmRlcmluZyBkZWxheSB1bnRpbCBhc3NldHMgYXJlIGxvYWRlZFxuICAgIE9iamVjdC5rZXlzKGFzc2V0cy5pbWFnZXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzW2tleV0gPSBuZXcgSW1hZ2UoKTtcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1trZXldLnNyYyA9IGFzc2V0cy5pbWFnZXNba2V5XTtcbiAgICB9KTtcbiAgICBPYmplY3Qua2V5cyhhc3NldHMuYXVkaW8pLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5hc3NldHMuYXVkaW9ba2V5XSA9IG5ldyBBdWRpbyhhc3NldHMuYXVkaW9ba2V5XSk7XG4gICAgfSk7XG5cbiAgICAvLyBpbml0aWFsaXNlIGRlYnVnIGNvbnRyb2xzXG4gICAgaWYgKHRoaXMuZGVidWcuZW5hYmxlZCkge1xuICAgICAgdGhpcy5pbml0aWFsaXNlRGVidWdnZXJMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXNlIGNhbnZhc1xuICAgIHRoaXMuY2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMoKTtcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuY29udGV4dC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcblxuICAgIC8vIGF0dGFjaCBjYW52YXMgdG8gdWlcbiAgICBjb250YWluZXIuYXBwZW5kKHRoaXMuY2FudmFzKTtcblxuICAgIC8vIGdvIGZ1bGxzY3JlZW5cbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIC8vIHRoaXMuY2FudmFzLnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgfSk7XG5cbiAgICAvLyBoYW5kbGUgdGFiYmVkIG91dCBzdGF0ZVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICAvLyBUT0RPKHNtZyk6IHBhdXNlIGZyYW1lIGV4ZWN1dGlvblxuICAgICAgICBjb25zb2xlLmxvZygndGFiIGlzIGFjdGl2ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETyhzbWcpOiBjb250aW51ZSBmcmFtZSBleGVjdXRpb25cbiAgICAgICAgY29uc29sZS5sb2coJ3RhYiBpcyBpbmFjdGl2ZScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gaW5pdGlhbGlzZSBnYW1lcGFkIGxpc3RlbmVyc1xuICAgIHRoaXMuaW50aWFsaXNlR2FtZXBhZExpc3RlbmVycygpO1xuXG4gICAgLy8gbG9hZCBmaXJzdCBzY2VuZVxuICAgIHRoaXMuY2hhbmdlU2NlbmUodGhpcy5zY2VuZXNbMF0pO1xuXG4gICAgLy8gUnVuIGdhbWUgbG9naWNcbiAgICB0aGlzLmZyYW1lKDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIC8vIGNyZWF0ZSBjYW52YXNcbiAgICBjb25zdCBjYW52YXMgPSBSZW5kZXJVdGlscy5jcmVhdGVDYW52YXMoKTtcblxuICAgIC8vIHByZXZlbnQgcmlnaHQgY2xpY2sgbWVudVxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjYW52YXM7XG4gIH1cblxuICAvLyBUT0RPKHNtZyk6IG5lZWQgc29tZSBzb3J0IG9mIHNjZW5lIGNsYXNzIGxpc3QgdHlwZVxuICBjaGFuZ2VTY2VuZShzY2VuZUNsYXNzOiBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50U2NlbmUgPSBSZWZsZWN0LmNvbnN0cnVjdChzY2VuZUNsYXNzLCBbdGhpc10pO1xuICB9XG5cbiAgLyoqXG4gICAqIE9uZSBmcmFtZSBvZiBnYW1lIGxvZ2ljXG4gICAqIEBwYXJhbSB0aW1lc3RhbXBcbiAgICovXG4gIHByaXZhdGUgZnJhbWUodGltZXN0YW1wOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWJ1Zy5icmVha3BvaW50LmZyYW1lKSB7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbZnJhbWVdICR7dGhpcy5kZWx0YX1gKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgRGVsYXRhXG4gICAgdGhpcy5zZXREZWx0YSh0aW1lc3RhbXApO1xuXG4gICAgLy8gQ2xlYXIgY2FudmFzIGJlZm9yZSByZW5kZXJcbiAgICBSZW5kZXJVdGlscy5jbGVhckNhbnZhcyh0aGlzLmNvbnRleHQpO1xuXG4gICAgLy8gcnVuIGZyYW1lIGxvZ2ljXG4gICAgdGhpcy5jdXJyZW50U2NlbmUuZnJhbWUodGhpcy5kZWx0YSk7XG5cbiAgICAvLyBSZW5kZXIgc3RhdHNcbiAgICBpZiAodGhpcy5kZWJ1Zy5zdGF0cy5mcHMpIHtcbiAgICAgIGlmICh0aGlzLmRlYnVnLnN0YXRzLmZwc0NvdW50ZXIpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJTdGF0cygwLCAnRlBTJywgYCR7TWF0aC5yb3VuZCgxMDAwIC8gKChwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMuZGVidWcuc3RhdHMuZnBzQ291bnRlcikpKX0gRlBTYCk7XG4gICAgICB9XG4gICAgICB0aGlzLmRlYnVnLnN0YXRzLmZwc0NvdW50ZXIgPSB0aW1lc3RhbXA7XG4gICAgfVxuICAgIGlmICh0aGlzLmRlYnVnLnN0YXRzLm9iamVjdENvdW50KSB7XG4gICAgICB0aGlzLnJlbmRlclN0YXRzKDEsICdPYmplY3RzJywgYCR7dGhpcy5jdXJyZW50U2NlbmUub2JqZWN0cy5sZW5ndGh9IG9iamVjdHNgKTtcbiAgICB9XG5cbiAgICAvLyBkZWJ1ZyBncmlkXG4gICAgdGhpcy5yZW5kZXJHcmlkKCk7XG5cbiAgICAvLyBjaGVjayBmb3IgbWFwIGNoYW5nZVxuICAgIGlmICh0aGlzLmN1cnJlbnRTY2VuZS5mbGFnZ2VkRm9yTWFwQ2hhbmdlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTY2VuZS5jaGFuZ2VNYXAodGhpcy5jdXJyZW50U2NlbmUuZmxhZ2dlZEZvck1hcENoYW5nZSk7XG4gICAgfVxuXG4gICAgLy8gQ2FsbCBuZXh0IGZyYW1lXG4gICAgLy8gKHdlIHNldCBgdGhpc2AgY29udGV4dCBmb3Igd2hlbiB1c2luZyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5mcmFtZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIHRpbWUgc2luY2UgdGhlIHByZXZpb3VzIGZyYW1lXG4gICAqIEBwYXJhbSB0aW1lc3RhbXBcbiAgICovXG4gIHByaXZhdGUgc2V0RGVsdGEodGltZXN0YW1wOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmRlbHRhID0gKHRpbWVzdGFtcCAtIHRoaXMubGFzdFJlbmRlclRpbWVzdGFtcCkgLyAxMDAwO1xuICAgIHRoaXMubGFzdFJlbmRlclRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMoaW5kZXg6IG51bWJlciwgbGFiZWw6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAncmVkJztcbiAgICB0aGlzLmNvbnRleHQuZm9udCA9ICcxMnB4IHNlcmlmJztcbiAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodmFsdWUsIHRoaXMuQ0FOVkFTX1dJRFRIIC0gNTAsIChpbmRleCArIDEpICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckdyaWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVidWcudWkuZ3JpZC5saW5lcyB8fCB0aGlzLmRlYnVnLnVpLmdyaWQubnVtYmVycykge1xuICAgICAgUmVuZGVyVXRpbHMuZmlsbFJlY3RhbmdsZSh0aGlzLmNvbnRleHQsIDAsIDAsIHRoaXMuQ0FOVkFTX1dJRFRILCB0aGlzLkNBTlZBU19IRUlHSFQsIHsgY29sb3VyOiAncmdiYSgwLCAwLCAwLCAwLjI1KScsIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnLnVpLmdyaWQubGluZXMpIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5DQU5WQVNfV0lEVEg7IHggKz0gQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkge1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuQ0FOVkFTX0hFSUdIVDsgeSArPSBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSB7XG4gICAgICAgICAgUmVuZGVyVXRpbHMuc3Ryb2tlUmVjdGFuZ2xlKHRoaXMuY29udGV4dCwgeCwgeSwgQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSwgQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSwgJ2JsYWNrJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Zy51aS5ncmlkLm51bWJlcnMpIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIOyB4KyspIHtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUOyB5KyspIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9ICc4cHggaGVsdmV0aWNhJztcbiAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoYCR7eH1gLCAoeCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpICsgMSwgKHkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSArIDgpOyAvLyA4IGlzIDggcHhcbiAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoYCR7eX1gLCAoeCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpICsgNiwgKHkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSArIDE0KTsgLy8gMTYgaXMgMTZweFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXNlRGVidWdnZXJMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQpID0+IHtcbiAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgIGNhc2UgJzEnOlxuICAgICAgICAgIHRoaXMuZGVidWcudWkuZ3JpZC5saW5lcyA9ICF0aGlzLmRlYnVnLnVpLmdyaWQubGluZXM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzInOlxuICAgICAgICAgIHRoaXMuZGVidWcudWkuZ3JpZC5udW1iZXJzID0gIXRoaXMuZGVidWcudWkuZ3JpZC5udW1iZXJzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICczJzpcbiAgICAgICAgICB0aGlzLmRlYnVnLmJyZWFrcG9pbnQuZnJhbWUgPSAhdGhpcy5kZWJ1Zy5icmVha3BvaW50LmZyYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc0JzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnN0YXRzLmZwcyA9ICF0aGlzLmRlYnVnLnN0YXRzLmZwcztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnNSc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy5zdGF0cy5vYmplY3RDb3VudCA9ICF0aGlzLmRlYnVnLnN0YXRzLm9iamVjdENvdW50O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc2JzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnRpbWluZy5mcmFtZSA9ICF0aGlzLmRlYnVnLnRpbWluZy5mcmFtZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnNyc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWVCYWNrZ3JvdW5kID0gIXRoaXMuZGVidWcudGltaW5nLmZyYW1lQmFja2dyb3VuZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnOCc6XG4gICAgICAgICAgdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWVSZW5kZXIgPSAhdGhpcy5kZWJ1Zy50aW1pbmcuZnJhbWVSZW5kZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzknOlxuICAgICAgICAgIHRoaXMuZGVidWcudGltaW5nLmZyYW1lVXBkYXRlID0gIXRoaXMuZGVidWcudGltaW5nLmZyYW1lVXBkYXRlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcwJzpcbiAgICAgICAgICB0aGlzLmRlYnVnLnVpLmNhbnZhc0xheWVycyA9ICF0aGlzLmRlYnVnLnVpLmNhbnZhc0xheWVycztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgLy8gbm90aGluZyB5ZXRcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgLy8gbm90aGluZyB5ZXRcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW50aWFsaXNlR2FtZXBhZExpc3RlbmVycygpOiB2b2lkIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ2FtZXBhZGNvbm5lY3RlZCcsIChldmVudDogR2FtZXBhZEV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJ0dhbWVwYWQgY29ubmVjdGVkIGF0IGluZGV4ICVkOiAlcy4gJWQgYnV0dG9ucywgJWQgYXhlcy4nLFxuICAgICAgICBldmVudC5nYW1lcGFkLmluZGV4LFxuICAgICAgICBldmVudC5nYW1lcGFkLmlkLFxuICAgICAgICBldmVudC5nYW1lcGFkLmJ1dHRvbnMubGVuZ3RoLFxuICAgICAgICBldmVudC5nYW1lcGFkLmF4ZXMubGVuZ3RoXG4gICAgICApO1xuICAgICAgdGhpcy5nYW1lcGFkID0gZXZlbnQuZ2FtZXBhZDtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ2FtZXBhZGRpc2Nvbm5lY3RlZCcsIChldmVudDogR2FtZXBhZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmdhbWVwYWQgPSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH1cbn1cbiIsIi8qKlxuICogRm9yIGxhbmRzY2FwZSBkZXZpY2VzICh0aGUgb25seSBvbmVzIEkgYW0gd2lsbGluZyB0byBzdXBwcG9ydCBmb3Igbm93KSwgd2Ugc2hvdWxkIGNhbGN1bGF0ZSBkZXZpY2UgYXNwZWN0IHJhdGlvIHRoZW4gc2V0IENBTlZJU19USUxFX1dJRFRIIGJhc2VkIG9mZiB0aGF0ICsgQ0FOVklTX1RJTEVfSEVJR0hUXG4gKiBUaGlzIG1lYW5zIFwicmVzb2x1dGlvblwiIHdpbGwgc3RpbGwgYmUgbG93IGJ1dCB3ZSBjYW4gZmlsbCB0aGUgZnVsbCBtb25pdG9yLCB3ZSBhbHNvIG5lZWQgdG8gc2V0IGNhbnZhcy53aWR0aCBhbG9uZyB3aXRoIHRoaXMgdmFsdWUuIHNob3VsZCBiZSBkb25lIG9uIGluaXRpYWxpc2F0aW9uIGFuZCBhbHNvIHdpbmRvdyByZXNpemluZ1xuICogTGVhdmUgYXMgaGFyZGNvZGVkIHZhbHVlIGZvciBub3dcbiovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2FudmFzQ29uc3RhbnRzIHtcbiAgLy8gMTggLyAzMFxuICBzdGF0aWMgQ0FOVkFTX1RJTEVfSEVJR0hUID0gMTg7IC8vIHRvdGFsIGhlaWdodCBpbiB0aWxlc1xuICBzdGF0aWMgQ0FOVkFTX1RJTEVfV0lEVEggPSAzMDsgLy8gdG90YWwgd2lkdGggaW4gdGlsZXNcbiAgc3RhdGljIFRJTEVfU0laRTogbnVtYmVyID0gMTY7IC8vIGUuZy4gMzIgbWVhbnMgYSBwaXhlbCBzaXplIG9mIHRpbGUgKDMycHggeCAzMnB4KVxuICBzdGF0aWMgT0JKRUNUX1JFTkRFUklOR19MQVlFUlM6IG51bWJlciA9IDE2OyAvLyBudW1iZXIgb2YgbGF5ZXJzIHRvIHJlbmRlciBvYmplY3RzIG9uLiBlLmcuIGZvciBhIHZhbHVlIG9mIDE2LCAwIGlzIHRoZSBsb3dlc3QgbGF5ZXIsIDE1IGlzIHRoZSBoaWdoZXN0XG4gIHN0YXRpYyBPQkpFQ1RfQ09MTElTSU9OX0xBWUVSUzogbnVtYmVyID0gMTY7IC8vIG51bWJlciBvZiBsYXllcnMgb24gd2hpY2ggb2JqZWN0cyBjYW4gY29sbGlkZS4gZS5nLiBmb3IgYSB2YWx1ZSBvZiAxNiwgMCBpcyB0aGUgbG93ZXN0IGxheWVyLCAxNSBpcyB0aGUgaGlnaGVzdFxuXG4gIC8qKlxuICAgKiBLZWVwIGFuIGV5ZSBvbiB0aGlzIGFuZCBhbnkgZ2V0dGVycywgZG9uJ3QgcnVuIGl0IG9uIGhvdCBjb2RlIHBhdGhzXG4gICAqL1xuICBzdGF0aWMgZ2V0IENBTlZBU19IRUlHSFQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAqIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQ7XG4gIH1cblxuICBzdGF0aWMgZ2V0IENBTlZBU19XSURUSCgpOiBudW1iZXIge1xuICAgIHJldHVybiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFICogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIO1xuICB9XG5cbiAgc3RhdGljIGdldCBBU1BFQ1RfUkFUSU8oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAvIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGF5ZXIgdGhhdCBVSSBlbGVtZW50cyBzaG91bGQgYmUgcmVuZGVyZWQgb25cbiAgICovXG4gIHN0YXRpYyBnZXQgVUlfUkVOREVSX0xBWUVSKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENhbnZhc0NvbnN0YW50cy5PQkpFQ1RfUkVOREVSSU5HX0xBWUVSUyAtIDE7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbGxpc2lvbiBsYXllciBmb3IgVUkgZWxlbWVudHMgc28gdGhhdCBnYW1lIGVsZW1lbnRzIGRvbid0IGludGVyYWN0IHdpdGggdGhlbVxuICAgKi9cbiAgc3RhdGljIGdldCBVSV9DT0xMSVNJT05fTEFZRVIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLk9CSkVDVF9DT0xMSVNJT05fTEFZRVJTIC0gMTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgQ0FOVkFTX0NFTlRFUl9USUxFX1koKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5DQU5WQVNfVElMRV9IRUlHSFQgLyAyO1xuICB9XG5cbiAgc3RhdGljIGdldCBDQU5WQVNfQ0VOVEVSX1RJTEVfWCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLkNBTlZBU19USUxFX1dJRFRIIC8gMjtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgQ0FOVkFTX0NFTlRFUl9QSVhFTF9YKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENhbnZhc0NvbnN0YW50cy5DQU5WQVNfV0lEVEggLyAyO1xuICB9XG5cbiAgc3RhdGljIGdldCBDQU5WQVNfQ0VOVEVSX1BJWEVMX1koKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19IRUlHSFQgLyAyO1xuICB9XG59XG4iLCJpbXBvcnQgeyB0eXBlIEFzc2V0cyB9IGZyb20gJy4vYXNzZXRzJztcbmltcG9ydCB7IHR5cGUgQmFja2dyb3VuZExheWVyIH0gZnJvbSAnLi9iYWNrZ3JvdW5kLWxheWVyJztcbmltcG9ydCB7IHR5cGUgU2NlbmUgfSBmcm9tICcuL3NjZW5lJztcbmltcG9ydCB7IHR5cGUgU2NlbmVPYmplY3QgfSBmcm9tICcuL3NjZW5lLW9iamVjdCc7XG5cbmV4cG9ydCB0eXBlIFNjZW5lTWFwQ29uc3RydWN0b3JTaWduYXR1cmUgPSBuZXcgKGNsaWVudDogU2NlbmUpID0+IFNjZW5lTWFwO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2NlbmVNYXAge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYmFja2dyb3VuZExheWVyczogQmFja2dyb3VuZExheWVyW107XG4gIG9iamVjdHM6IFNjZW5lT2JqZWN0W107XG4gIGdsb2JhbHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICBwcm90ZWN0ZWQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcm90ZWN0ZWQgYXNzZXRzOiBBc3NldHM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHNjZW5lOiBTY2VuZVxuICApIHtcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLnNjZW5lLmNvbnRleHQ7XG4gICAgdGhpcy5hc3NldHMgPSB0aGlzLnNjZW5lLmFzc2V0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbWFwIGlzIGRlc3Ryb3llZFxuICAgKi9cbiAgZGVzdHJveT8oKTogdm9pZCB7XG4gICAgLy8gZG8gbm90aGluZyBieSBkZWZhdWx0XG4gIH1cbn1cbiIsImltcG9ydCB7IFJlbmRlclV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvcmVuZGVyLnV0aWxzJztcbmltcG9ydCB7IHR5cGUgU2NlbmUgfSBmcm9tICcuL3NjZW5lJztcbmltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgQXNzZXRzIH0gZnJvbSAnLi9hc3NldHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBvc2l0aW9uWD86IG51bWJlcjtcbiAgcG9zaXRpb25ZPzogbnVtYmVyO1xuICB0YXJnZXRYPzogbnVtYmVyO1xuICB0YXJnZXRZPzogbnVtYmVyO1xuXG4gIGlzUmVuZGVyYWJsZT86IGJvb2xlYW47XG4gIHJlbmRlckxheWVyPzogbnVtYmVyO1xuICByZW5kZXJPcGFjaXR5PzogbnVtYmVyO1xuICByZW5kZXJTY2FsZT86IG51bWJlcjtcblxuICBoYXNDb2xsaXNpb24/OiBib29sZWFuO1xuICBjb2xsaXNpb25MYXllcj86IG51bWJlcjtcbn1cblxuY29uc3QgREVGQVVMVF9JU19SRU5ERVJBQkxFOiBib29sZWFuID0gZmFsc2U7XG5jb25zdCBERUZBVUxUX1JFTkRFUl9MQVlFUjogbnVtYmVyID0gMDtcbmNvbnN0IERFRkFVTFRfUkVOREVSX09QQUNJVFk6IG51bWJlciA9IDE7XG5jb25zdCBERUZBVUxUX1JFTkRFUl9TQ0FMRTogbnVtYmVyID0gMTtcblxuY29uc3QgREVGQVVMVF9IQVNfQ09MTElTSU9OOiBib29sZWFuID0gZmFsc2U7XG5jb25zdCBERUZBVUxUX0NPTExJU0lPTl9MQVlFUjogbnVtYmVyID0gMDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjZW5lT2JqZWN0IHtcbiAgaWQ6IHN0cmluZyA9IGNyeXB0by5yYW5kb21VVUlEKCk7XG5cbiAgLy8gcG9zaXRpb25cbiAgcG9zaXRpb25YOiBudW1iZXIgPSAtMTtcbiAgcG9zaXRpb25ZOiBudW1iZXIgPSAtMTtcbiAgdGFyZ2V0WDogbnVtYmVyID0gLTE7XG4gIHRhcmdldFk6IG51bWJlciA9IC0xO1xuXG4gIC8vIGRpbWVuc2lvbnNcbiAgd2lkdGg6IG51bWJlciA9IDE7XG4gIGhlaWdodDogbnVtYmVyID0gMTtcblxuICAvLyBjb2xsaXNpb25cbiAgaGFzQ29sbGlzaW9uOiBib29sZWFuO1xuICBjb2xsaXNpb25MYXllcjogbnVtYmVyO1xuXG4gIC8vIHJlbmRlcmluZ1xuICBpc1JlbmRlcmFibGU6IGJvb2xlYW47XG4gIHJlbmRlckxheWVyOiBudW1iZXI7XG4gIHJlbmRlck9wYWNpdHk6IG51bWJlcjsgLy8gdGhlIG9wYWNpdHkgb2YgdGhlIG9iamVjdCB3aGVuIHJlbmRlcmVkICh2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEpXG4gIHJlbmRlclNjYWxlOiBudW1iZXI7IC8vIHRoZSBzY2FsZSBvZiB0aGUgb2JqZWN0IHdoZW4gcmVuZGVyZWRcblxuICAvLyBUT0RPKHNtZyk6IEknbSBub3QgY29udmluY2VkIG9mIHRoaXMgYnV0IEkgd2lsbCBnbyB3aXRoIGl0IGZvciBub3dcbiAga2V5TGlzdGVuZXJzOiBSZWNvcmQ8c3RyaW5nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+ID0ge307IC8vIGZvciBrZXlib2FyZCBldmVudHNcbiAgZXZlbnRMaXN0ZW5lcnM6IFJlY29yZDxzdHJpbmcsIChldmVudDogQ3VzdG9tRXZlbnQpID0+IHZvaWQ+ID0ge307IC8vIGZvciBzY2VuZSBldmVudHNcblxuICBwcm90ZWN0ZWQgbWFpbkNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJvdGVjdGVkIGFzc2V0czogQXNzZXRzO1xuXG4gIC8vIGZsYWdzXG4gIGZsYWdnZWRGb3JSZW5kZXI6IGJvb2xlYW4gPSB0cnVlOyAvLyBUT0RPKHNtZyk6IGltcGxlbWVudCB0aGUgdXNhZ2Ugb2YgdGhpcyBmbGFnIHRvIGltcHJvdmUgZW5naW5lIHBlcmZvcm1hbmNlXG4gIGZsYWdnZWRGb3JVcGRhdGU6IGJvb2xlYW4gPSB0cnVlOyAvLyBUT0RPKHNtZyk6IGltcGxlbWVudCB0aGUgdXNhZ2Ugb2YgdGhpcyBmbGFnIHRvIGltcHJvdmUgZW5naW5lIHBlcmZvcm1hbmNlXG4gIGZsYWdnZWRGb3JEZXN0cm95OiBib29sZWFuID0gZmFsc2U7IC8vIFRPRE8oc21nKTogaW1wbGVtZW50IHRoaXMuIHVzZWQgdG8gcmVtb3ZlIG9iamVjdCBmcm9tIHNjZW5lIG9uIG5leHQgdXBkYXRlIHJhdGhlciB0aGFuIG1pZCB1cGRhdGUgZXRjXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHNjZW5lOiBTY2VuZSxcbiAgICBjb25maWc6IFNjZW5lT2JqZWN0QmFzZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLm1haW5Db250ZXh0ID0gdGhpcy5zY2VuZS5jb250ZXh0O1xuICAgIHRoaXMuYXNzZXRzID0gdGhpcy5zY2VuZS5hc3NldHM7XG5cbiAgICAvLyBwb3NpdGlvbiBkZWZhdWx0XG4gICAgaWYgKGNvbmZpZy5wb3NpdGlvblggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5wb3NpdGlvblggPSBjb25maWcucG9zaXRpb25YO1xuICAgICAgaWYgKGNvbmZpZy50YXJnZXRYID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy50YXJnZXRYID0gdGhpcy5wb3NpdGlvblg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5wb3NpdGlvblkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5wb3NpdGlvblkgPSBjb25maWcucG9zaXRpb25ZO1xuICAgICAgaWYgKGNvbmZpZy50YXJnZXRZID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy50YXJnZXRZID0gdGhpcy5wb3NpdGlvblk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy50YXJnZXRYICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGFyZ2V0WCA9IGNvbmZpZy50YXJnZXRYO1xuICAgIH1cblxuICAgIGlmIChjb25maWcudGFyZ2V0WSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRhcmdldFkgPSBjb25maWcudGFyZ2V0WTtcbiAgICB9XG5cbiAgICB0aGlzLmlzUmVuZGVyYWJsZSA9IGNvbmZpZy5pc1JlbmRlcmFibGUgPz8gREVGQVVMVF9JU19SRU5ERVJBQkxFO1xuICAgIHRoaXMucmVuZGVyTGF5ZXIgPSBjb25maWcucmVuZGVyTGF5ZXIgPz8gREVGQVVMVF9SRU5ERVJfTEFZRVI7XG4gICAgdGhpcy5yZW5kZXJPcGFjaXR5ID0gY29uZmlnLnJlbmRlck9wYWNpdHkgPz8gREVGQVVMVF9SRU5ERVJfT1BBQ0lUWTtcblxuICAgIHRoaXMuaGFzQ29sbGlzaW9uID0gY29uZmlnLmhhc0NvbGxpc2lvbiA/PyBERUZBVUxUX0hBU19DT0xMSVNJT047XG4gICAgdGhpcy5jb2xsaXNpb25MYXllciA9IGNvbmZpZy5jb2xsaXNpb25MYXllciA/PyBERUZBVUxUX0NPTExJU0lPTl9MQVlFUjtcbiAgICB0aGlzLnJlbmRlclNjYWxlID0gY29uZmlnLnJlbmRlclNjYWxlID8/IERFRkFVTFRfUkVOREVSX1NDQUxFO1xuICB9XG5cbiAgdXBkYXRlPyhkZWx0YTogbnVtYmVyKTogdm9pZDtcbiAgcmVuZGVyPyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkO1xuICBkZXN0cm95PygpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBVc2VkIGZvciBkZWJ1Z2dpbmdcbiAgICogQHBhcmFtIGNvbnRleHRcbiAgICovXG4gIGRlYnVnZ2VyUmVuZGVyQm91bmRhcnkoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgUmVuZGVyVXRpbHMuc3Ryb2tlUmVjdGFuZ2xlKFxuICAgICAgY29udGV4dCxcbiAgICAgIE1hdGguZmxvb3IodGhpcy5wb3NpdGlvblggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSxcbiAgICAgIE1hdGguZmxvb3IodGhpcy5wb3NpdGlvblkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSxcbiAgICAgIE1hdGguZmxvb3IodGhpcy53aWR0aCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLmhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgJ3JlZCdcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgZm9yIGRlYnVnZ2luZ1xuICAgKiBAcGFyYW0gY29udGV4dFxuICAgKi9cbiAgZGVidWdnZXJSZW5kZXJCYWNrZ3JvdW5kKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIFJlbmRlclV0aWxzLmZpbGxSZWN0YW5nbGUoXG4gICAgICBjb250ZXh0LFxuICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICB0aGlzLnBvc2l0aW9uWSxcbiAgICAgIE1hdGguZmxvb3IodGhpcy53aWR0aCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgTWF0aC5mbG9vcih0aGlzLmhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLFxuICAgICAgeyBjb2xvdXI6ICdyZWQnLCB9XG4gICAgKTtcbiAgfVxuXG4gIGdldCBjYW1lcmFSZWxhdGl2ZVBvc2l0aW9uWCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uWCArIHRoaXMuc2NlbmUuZ2xvYmFscy5jYW1lcmEuc3RhcnRYO1xuICB9XG5cbiAgZ2V0IGNhbWVyYVJlbGF0aXZlUG9zaXRpb25ZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25ZICsgdGhpcy5zY2VuZS5nbG9iYWxzLmNhbWVyYS5zdGFydFk7XG4gIH1cblxuICBnZXQgcGl4ZWxXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRTtcbiAgfVxuXG4gIGdldCBwaXhlbEhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkU7XG4gIH1cblxuICBnZXQgYm91bmRpbmdYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25YICsgdGhpcy53aWR0aDtcbiAgfVxuXG4gIGdldCBib3VuZGluZ1koKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvblkgKyB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIGlzQ29sbGlkaW5nV2l0aChvYmplY3Q6IFNjZW5lT2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNXaXRoaW5Ib3Jpem9udGFsQm91bmRzKG9iamVjdCkgJiYgdGhpcy5pc1dpdGhpblZlcnRpY2FsQm91bmRzKG9iamVjdCk7XG4gIH1cblxuICBpc1dpdGhpbkhvcml6b250YWxCb3VuZHMob2JqZWN0OiBTY2VuZU9iamVjdCk6IGJvb2xlYW4ge1xuICAgIGlmIChvYmplY3QucG9zaXRpb25YID49IHRoaXMucG9zaXRpb25YICYmIG9iamVjdC5wb3NpdGlvblggPD0gdGhpcy5ib3VuZGluZ1gpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChvYmplY3QuYm91bmRpbmdYID49IHRoaXMucG9zaXRpb25YICYmIG9iamVjdC5ib3VuZGluZ1ggPD0gdGhpcy5ib3VuZGluZ1gpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzV2l0aGluVmVydGljYWxCb3VuZHMob2JqZWN0OiBTY2VuZU9iamVjdCk6IGJvb2xlYW4ge1xuICAgIGlmIChvYmplY3QucG9zaXRpb25ZID49IHRoaXMucG9zaXRpb25ZICYmIG9iamVjdC5wb3NpdGlvblkgPD0gdGhpcy5ib3VuZGluZ1kpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChvYmplY3QuYm91bmRpbmdZID49IHRoaXMucG9zaXRpb25ZICYmIG9iamVjdC5ib3VuZGluZ1kgPD0gdGhpcy5ib3VuZGluZ1kpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuaW1wb3J0IHsgdHlwZSBCYWNrZ3JvdW5kTGF5ZXIgfSBmcm9tICcuL2JhY2tncm91bmQtbGF5ZXInO1xuaW1wb3J0IHsgdHlwZSBTY2VuZU1hcENvbnN0cnVjdG9yU2lnbmF0dXJlLCB0eXBlIFNjZW5lTWFwIH0gZnJvbSAnLi9zY2VuZS1tYXAnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZU9iamVjdCB9IGZyb20gJy4vc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IE1vdXNlVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9tb3VzZS51dGlscyc7XG5pbXBvcnQgeyB0eXBlIENsaWVudCB9IGZyb20gJ0Bjb3JlL2NsaWVudCc7XG5pbXBvcnQgeyB0eXBlIEFzc2V0cyB9IGZyb20gJy4vYXNzZXRzJztcblxuZXhwb3J0IHR5cGUgU2NlbmVDb25zdHJ1Y3RvclNpZ25hdHVyZSA9IG5ldyAoY2xpZW50OiBDbGllbnQpID0+IFNjZW5lO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjZW5lUmVuZGVyaW5nQ29udGV4dCB7XG4gIGJhY2tncm91bmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRFtdO1xuICBvYmplY3RzOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkRbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY2VuZUdsb2JhbHNCYXNlQ29uZmlnIHtcbiAgbW91c2U6IHtcbiAgICBjbGljazoge1xuICAgICAgbGVmdDogYm9vbGVhbjtcbiAgICAgIG1pZGRsZTogYm9vbGVhbjtcbiAgICAgIHJpZ2h0OiBib29sZWFuO1xuICAgIH07XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IG51bWJlcjtcbiAgICAgIHk6IG51bWJlcjtcbiAgICAgIGV4YWN0WDogbnVtYmVyOyAvLyBub3Qgcm91bmRlZCB0byB0aWxlXG4gICAgICBleGFjdFk6IG51bWJlcjsgLy8gbm90IHJvdW5kZWQgdG8gdGlsZVxuICAgIH07XG4gIH07XG5cbiAga2V5Ym9hcmQ6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+O1xuXG4gIC8vIFRPRE8oc21nKTogY2FtZXJhUG9zaXRpb24gaXMgcmVmZXJyaW5nIHRvIGN1c3RvbVJlbmRlcmVyLCBwZXJoYXBzIHJlbmFtZSBjdXN0b21SZW5kZXJlciB0byBjYW1lcmE/XG4gIGNhbWVyYToge1xuICAgIHN0YXJ0WDogbnVtYmVyO1xuICAgIHN0YXJ0WTogbnVtYmVyO1xuICAgIGVuZFg6IG51bWJlcjtcbiAgICBlbmRZOiBudW1iZXI7XG4gIH07XG4gIGxhdGVzdE1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQ7XG59XG5cbmV4cG9ydCB0eXBlIEN1c3RvbVJlbmRlcmVyU2lnbmF0dXJlID0gKHJlbmRlcmluZ0NvbnRleHQ6IFNjZW5lUmVuZGVyaW5nQ29udGV4dCkgPT4gdm9pZDtcbi8qKlxuXG4gIGFkZGluZyBhIHF1aWNrIGRlc2NyaXB0aW9uIGhlcmUgYXMgdGhpcyBzaGFwZSBpcyBwcmV0dHkgZ3Jvc3MgYnV0IEkgdGhpbmsgaXQgd2lsbCBiZSBzb21ld2hhdCBwZXJmb3JtYW50IGF0IHNjYWxlXG4gIHdoZXJlIDxudW1iZXI+IGZyb20gbGVmdCB0byByaWdodCBpcywgPHNjZW5lIGluZGV4PiwgPHggcG9zaXRpb24+LCA8eSBwb3NpdGlvbj4sIDxhbmltYXRpb24gdGltZXIgaW4gc2Vjb25kcz5cblxuICBiYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXI6IFJlY29yZDxudW1iZXIsIFJlY29yZDxudW1iZXIsIFJlY29yZDxudW1iZXIsIG51bWJlcj4+PlxuICBiYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXIgPSB7XG4gICAgMDoge1xuICAgICAgMDoge1xuICAgICAgICAwOiAwXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiovXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTY2VuZSB7XG4gIC8vIGJhY2tncm91bmRcbiAgYmFja2dyb3VuZExheWVyczogQmFja2dyb3VuZExheWVyW107XG4gIGJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcjogUmVjb3JkPG51bWJlciwgUmVjb3JkPG51bWJlciwgUmVjb3JkPG51bWJlciwgbnVtYmVyPj4+ID0ge307IC8vIHVzZWQgZm9yIHRpbWluZ3MgZm9yIGJhY2tncm91bmQgbGF5ZXIgYW5pbWF0aW9uc1xuXG4gIC8vIG9iamVjdHNcbiAgb2JqZWN0czogU2NlbmVPYmplY3RbXSA9IFtdO1xuICAvLyBUT0RPKHNtZyk6IGhvdyBkbyB3ZSBhY2Nlc3MgdHlwZXMgZm9yIHRoaXMgZnJvbSB0aGUgc2NlbmUgb2JqZWN0P1xuXG4gIC8vIGEgcGxhY2UgdG8gc3RvcmUgZmxhZ3MgZm9yIHRoZSBzY2VuZVxuICByZWFkb25seSBnbG9iYWxzOiBTY2VuZUdsb2JhbHNCYXNlQ29uZmlnID0ge1xuICAgIG1vdXNlOiB7XG4gICAgICBjbGljazoge1xuICAgICAgICBsZWZ0OiBmYWxzZSxcbiAgICAgICAgbWlkZGxlOiBmYWxzZSxcbiAgICAgICAgcmlnaHQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIGV4YWN0WDogMCxcbiAgICAgICAgZXhhY3RZOiAwLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNhbWVyYToge1xuICAgICAgc3RhcnRYOiAwLFxuICAgICAgc3RhcnRZOiAwLFxuICAgICAgZW5kWDogMCxcbiAgICAgIGVuZFk6IDAsXG4gICAgfSxcbiAgICBrZXlib2FyZDoge30sXG4gICAgbGF0ZXN0TW91c2VFdmVudDogbmV3IE1vdXNlRXZlbnQoJycpLFxuICB9O1xuXG4gIC8vIG1hcHNcbiAgLy8gVE9ETyhzbWcpOiBjaGFuZ2UgdGhpcyBzbyB5b3UgY2FuIHBhc3MgaW4gYSBtYXAgY2xhc3MgZGlyZWN0bHkgYW5kIHRoZSB0eXBlIHVzZXMgU2NlbmVNYXBDb25zdHJ1Y3RvclNpZ25hdHVyZSB8IHVuZGVmaW5lZFxuICBmbGFnZ2VkRm9yTWFwQ2hhbmdlOiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7IC8vIGlmIHRoaXMgaXMgc2V0LCB0aGUgc2NlbmUgd2lsbCBjaGFuZ2UgdG8gdGhlIG1hcCBhdCB0aGUgcHJvdmlkZWQgaW5kZXggb24gdGhlIG5leHQgZnJhbWVcbiAgbWFwczogU2NlbmVNYXBDb25zdHJ1Y3RvclNpZ25hdHVyZVtdID0gW107IC8vIFRPRE8oc21nKTogc29tZSBzb3J0IG9mIGJldHRlciB0eXBpbmcgZm9yIHRoaXMsIGl0IGlzIGEgbGlzdCBvZiB1bmluc3RhbmNpYXRlZCBjbGFzc2VzIHRoYXQgZXh0ZW5kIFNjZW5lTWFwXG4gIG1hcDogU2NlbmVNYXA7IC8vIHRoZSBjdXJyZW50IG1hcFxuXG4gIC8vIHJlbmRlcmluZyBjb250ZXh0c1xuICByZW5kZXJpbmdDb250ZXh0OiBTY2VuZVJlbmRlcmluZ0NvbnRleHQgPSB7XG4gICAgYmFja2dyb3VuZDogW10sXG4gICAgb2JqZWN0czogW10sXG4gIH07XG5cbiAgLy8gZm9yIGZpcmluZyBldmVudHNcbiAgcHJpdmF0ZSByZWFkb25seSBldmVudEVtaXR0ZXI6IEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdldmVudEVtaXR0ZXInKTtcbiAgcmVhZG9ubHkgZXZlbnRUeXBlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9OyAvLyBUT0RPKHNtZyk6IHNvbWUgd2F5IHR5cGluZyB0aGlzIHNvIHRoZXJlIGlzIGludGVsbGlzZW5zZSBmb3IgZXZlbnQgdHlwZXMgZm9yIGEgc2NlbmVcblxuICBwcml2YXRlIGN1c3RvbVJlbmRlcmVyPzogQ3VzdG9tUmVuZGVyZXJTaWduYXR1cmU7XG5cbiAgLy8gZnJvbSBjbGllbnRcbiAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBhc3NldHM6IEFzc2V0cztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY2xpZW50OiBDbGllbnRcbiAgKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jbGllbnQuY29udGV4dDtcbiAgICB0aGlzLmFzc2V0cyA9IHRoaXMuY2xpZW50LmFzc2V0cztcblxuICAgIC8vIHNldCB1cCBtb3VzZSBsaXN0ZW5lclxuICAgIGNsaWVudC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmdsb2JhbHMubW91c2UucG9zaXRpb24gPSBNb3VzZVV0aWxzLmdldE1vdXNlUG9zaXRpb24oY2xpZW50LmNhbnZhcywgZXZlbnQpO1xuICAgICAgdGhpcy5nbG9iYWxzLmxhdGVzdE1vdXNlRXZlbnQgPSBldmVudDtcbiAgICB9KTtcblxuICAgIC8vIG1vdXNlXG4gICAgY2xpZW50LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdbbW91c2Vkb3duXScsIGV2ZW50KTtcbiAgICAgIHN3aXRjaCAoZXZlbnQuYnV0dG9uKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2subWlkZGxlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5yaWdodCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjbGllbnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdbbW91c2V1cF0nLCBldmVudCk7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmJ1dHRvbikge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgdGhpcy5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5taWRkbGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5yaWdodCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gdG91Y2hcbiAgICBjbGllbnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdbdG91Y2hzdGFydF0nLCBldmVudCk7XG4gICAgICB0aGlzLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBjbGllbnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnW3RvdWNoZW5kXScsIGV2ZW50KTtcbiAgICAgIHRoaXMuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQucmVwZWF0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCdba2V5ZG93bl0nLCBldmVudCk7XG4gICAgICB0aGlzLmdsb2JhbHMua2V5Ym9hcmRbZXZlbnQua2V5LnRvTG9jYWxlTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQucmVwZWF0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ1trZXl1cF0nLCBldmVudCk7XG4gICAgICB0aGlzLmdsb2JhbHMua2V5Ym9hcmRbZXZlbnQua2V5LnRvTG9jYWxlTG93ZXJDYXNlKCldID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBiYWNrZ3JvdW5kTGF5ZXJBbmltYXRpb25GcmFtZTogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuXG4gIC8vIFRPRE8oc21nKTogbW92ZSBjbGllbnQgcmVuZGVyaW5nIGNvZGUgaW50byBoZXJlXG4gIGZyYW1lKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlckJhY2tncm91bmQoZGVsdGEpO1xuICAgIHRoaXMudXBkYXRlT2JqZWN0cyhkZWx0YSk7XG4gICAgdGhpcy5yZW5kZXJPYmplY3RzKGRlbHRhKTtcblxuICAgIGlmICh0aGlzLmN1c3RvbVJlbmRlcmVyKSB7XG4gICAgICB0aGlzLmN1c3RvbVJlbmRlcmVyKHRoaXMucmVuZGVyaW5nQ29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVmYXVsdFJlbmRlcmVyKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQmFja2dyb3VuZChkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLnRpbWluZy5mcmFtZUJhY2tncm91bmQpIHtcbiAgICAgIGNvbnNvbGUudGltZSgnW2ZyYW1lXSBiYWNrZ3JvdW5kJyk7XG4gICAgfVxuXG4gICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzLmZvckVhY2goKGxheWVyLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQuYmFja2dyb3VuZFtpbmRleF07XG4gICAgICBSZW5kZXJVdGlscy5jbGVhckNhbnZhcyhjb250ZXh0KTtcblxuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLm1hcC53aWR0aDsgeCsrKSB7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5tYXAuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICBsZXQgdGlsZSA9IGxheWVyLnRpbGVzW3hdID8gbGF5ZXIudGlsZXNbeF1beV0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgYW5pbWF0aW9uRnJhbWU7XG4gICAgICAgICAgaWYgKHRpbGUuYW5pbWF0aW9uRnJhbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gc2tpcCBhbmltYXRpb25zIGlmIG9ubHkgMSBzcHJpdGVcbiAgICAgICAgICAgIGFuaW1hdGlvbkZyYW1lID0gdGlsZS5hbmltYXRpb25GcmFtZXNbMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRpbWVyIGhhcyBzdGFydGVkIGZvciBzcGVjaWZpYyB0aWxlIG9uIHNwZWNpZmljIGxheWVyXG4gICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXJbbGF5ZXIuaW5kZXhdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXJbbGF5ZXIuaW5kZXhdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcltsYXllci5pbmRleF1beF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRMYXllcnNBbmltYXRpb25UaW1lcltsYXllci5pbmRleF1beF0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHRpbWVyO1xuICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZExheWVyc0FuaW1hdGlvblRpbWVyW2xheWVyLmluZGV4XVt4XVt5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHRpbWVyID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRpbWVyID0gdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXJbbGF5ZXIuaW5kZXhdW3hdW3ldICsgZGVsdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHdyYXAgdGltZXIgaWYgb3ZlciBhbmltYXRpb24gZnJhbWUgZHVyYXRpb25cbiAgICAgICAgICAgIGlmICh0aW1lciA+IHRpbGUuYW5pbWF0aW9uRnJhbWVEdXJhdGlvbikge1xuICAgICAgICAgICAgICB0aW1lciA9IHRpbWVyICUgdGlsZS5hbmltYXRpb25GcmFtZUR1cmF0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGUuYW5pbWF0aW9uTWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmICh0aW1lciA8PSB0aWxlLmFuaW1hdGlvbk1hcFtpXSkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkZyYW1lID0gdGlsZS5hbmltYXRpb25GcmFtZXNbaV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXJzQW5pbWF0aW9uVGltZXJbbGF5ZXIuaW5kZXhdW3hdW3ldID0gdGltZXI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1t0aWxlLnRpbGVzZXRdLFxuICAgICAgICAgICAgYW5pbWF0aW9uRnJhbWUuc3ByaXRlWCxcbiAgICAgICAgICAgIGFuaW1hdGlvbkZyYW1lLnNwcml0ZVksXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy50aW1pbmcuZnJhbWVCYWNrZ3JvdW5kKSB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ1tmcmFtZV0gYmFja2dyb3VuZCcpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU9iamVjdHMoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy50aW1pbmcuZnJhbWVVcGRhdGUpIHtcbiAgICAgIGNvbnNvbGUudGltZSgnW2ZyYW1lXSB1cGRhdGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLm9iamVjdHMuZm9yRWFjaCgob2JqZWN0KSA9PiB7XG4gICAgICBpZiAob2JqZWN0LnVwZGF0ZSkge1xuICAgICAgICBvYmplY3QudXBkYXRlKGRlbHRhKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy50aW1pbmcuZnJhbWVVcGRhdGUpIHtcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnW2ZyYW1lXSB1cGRhdGUnKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJPYmplY3RzKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcudGltaW5nLmZyYW1lUmVuZGVyKSB7XG4gICAgICBjb25zb2xlLnRpbWUoJ1tmcmFtZV0gcmVuZGVyJyk7XG4gICAgfVxuXG4gICAgLy8gY2xlYXIgb2JqZWN0IGNhbnZhc2VzXG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0Lm9iamVjdHMuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xuICAgICAgUmVuZGVyVXRpbHMuY2xlYXJDYW52YXMoY29udGV4dCk7XG4gICAgfSk7XG5cbiAgICAvLyByZW5kZXIgb2JqZWN0c1xuICAgIHRoaXMub2JqZWN0cy5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy5vYmplY3QucmVuZGVyQmFja2dyb3VuZCkge1xuICAgICAgICBvYmplY3QuZGVidWdnZXJSZW5kZXJCYWNrZ3JvdW5kKFxuICAgICAgICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5vYmplY3RzW29iamVjdC5yZW5kZXJMYXllcl1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iamVjdC5yZW5kZXIgJiYgb2JqZWN0LmlzUmVuZGVyYWJsZSkge1xuICAgICAgICBvYmplY3QucmVuZGVyKFxuICAgICAgICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5vYmplY3RzW29iamVjdC5yZW5kZXJMYXllcl1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnLm9iamVjdC5yZW5kZXJCb3VuZGFyeSkge1xuICAgICAgICBvYmplY3QuZGVidWdnZXJSZW5kZXJCb3VuZGFyeShcbiAgICAgICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQub2JqZWN0c1tvYmplY3QucmVuZGVyTGF5ZXJdXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcudGltaW5nLmZyYW1lUmVuZGVyKSB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ1tmcmFtZV0gcmVuZGVyJyk7XG4gICAgfVxuICB9XG5cbiAgZGVmYXVsdFJlbmRlcmVyKCk6IHZvaWQge1xuICAgIC8vIHNldCBjYW1lcmEgcG9zaXRpb25zXG4gICAgdGhpcy5nbG9iYWxzLmNhbWVyYS5zdGFydFggPSAwO1xuICAgIHRoaXMuZ2xvYmFscy5jYW1lcmEuc3RhcnRZID0gMDtcbiAgICB0aGlzLmdsb2JhbHMuY2FtZXJhLmVuZFggPSAwO1xuICAgIHRoaXMuZ2xvYmFscy5jYW1lcmEuZW5kWSA9IDA7XG5cbiAgICAvLyByZW5kZXJcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQuYmFja2dyb3VuZC5mb3JFYWNoKChjb250ZXh0KSA9PiB7XG4gICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKGNvbnRleHQuY2FudmFzLCAwLCAwKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQub2JqZWN0cy5mb3JFYWNoKChjb250ZXh0KSA9PiB7XG4gICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKGNvbnRleHQuY2FudmFzLCAwLCAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZE9iamVjdChzY2VuZU9iamVjdDogU2NlbmVPYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLm9iamVjdHMucHVzaChzY2VuZU9iamVjdCk7XG4gIH1cblxuICAvLyBUT0RPKHNtZyk6IEkgYW0gcmV0aGlua2luZyB0aGUgY29uY2VwdCBvZiByZW1vdmluZyB0aGUgb2JqZWN0IGZyb20gdGhlIHNjZW5lIGR1cmluZyBhbm90aGVyIG9iamVjdCdzIHVwZGF0ZS5cbiAgLy8gSSB0aGluayBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gaGF2ZSBhIGZsYWcgdGhhdCBpcyBjaGVja2VkIGR1cmluZyB0aGUgc2NlbmUncyB1cGRhdGUgbG9vcCB0byBybW92ZSB0aGUgb2JlamN0IGJlZm9yZSBpdCdzIG5leHQgdXBkYXRlXG4gIC8vIHBlcmhhcHMgdXNpbmcgZmxhZ2dlZEZvckRlc3Ryb3lcbiAgcmVtb3ZlT2JqZWN0KHNjZW5lT2JqZWN0OiBTY2VuZU9iamVjdCk6IHZvaWQge1xuICAgIGlmIChzY2VuZU9iamVjdC5kZXN0cm95KSB7XG4gICAgICBzY2VuZU9iamVjdC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMub2JqZWN0cy5zcGxpY2UodGhpcy5vYmplY3RzLmluZGV4T2Yoc2NlbmVPYmplY3QpLCAxKTtcbiAgfVxuXG4gIC8vIFRPRE8oc21nKTogdGhpcyBwcmV2ZW50cyB3ZWlyZCBpc3N1ZXMgY2F1c2VkIGJ5IGNhbGxpbmcgcmVtb3ZlT2JqZWN0IG11bHRpcGxlIHRpbWVzIGRpcmVjdGx5IGZvciB0aGUgc2FtZSBvYmplY3QgYnV0IGl0IGlzIGluZWZmaWNpZW50XG4gIC8vIHJldmlldyB0aGlzIGF0IGEgbGF0ZXIgc3RhZ2VcbiAgcmVtb3ZlT2JqZWN0QnlJZChzY2VuZU9iamVjdElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgb2JqZWN0ID0gdGhpcy5vYmplY3RzLmZpbmQobyA9PiBvLmlkID09PSBzY2VuZU9iamVjdElkKTtcbiAgICBpZiAob2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVPYmplY3Qob2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBpbnN0YW5jZXMgb2YgdGhlIHByb3ZpZGVkIGNsYXNzXG4gICAqIEBwYXJhbSB0eXBlXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBnZXRPYmplY3RzQnlUeXBlKHR5cGU6IGFueSk6IFNjZW5lT2JqZWN0W10ge1xuICAgIC8vIFRPRE8oc21nKTogaG9ycmlibHkgdW5kZXJwZXJmb3JtYW50LCBwZXJoYXBzIHVzZSBhIGhhc2ggb24gb2JqZWN0IHR5cGUgaW5zdGVhZD9cbiAgICByZXR1cm4gdGhpcy5vYmplY3RzLmZpbHRlcihvID0+IG8gaW5zdGFuY2VvZiB0eXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW4gb2JqZWN0IGV4aXN0cyBhdCB0aGUgcHJvdmlkZWQgcG9zaXRpb24gYW5kIGhhcyBjb2xsaXNpb25cbiAgICogQHBhcmFtIHhcbiAgICogQHBhcmFtIHlcbiAgICogQHJldHVybnNcbiAgICovXG4gIGhhc0NvbGxpc2lvbkF0UG9zaXRpb24ocG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCBzY2VuZU9iamVjdD86IFNjZW5lT2JqZWN0KTogYm9vbGVhbiB7XG4gICAgbGV0IG9iamVjdCA9IHRoaXMub2JqZWN0cy5maW5kKG8gPT4gby5wb3NpdGlvblggPT09IHBvc2l0aW9uWCAmJiBvLnBvc2l0aW9uWSA9PT0gcG9zaXRpb25ZICYmIG8uaGFzQ29sbGlzaW9uKTtcbiAgICBpZiAob2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBpZ25vcmUgcHJvdmlkZWQgb2JqZWN0ICh1c3VhbGx5IHNlbGYpXG4gICAgaWYgKHNjZW5lT2JqZWN0ID09PSBvYmplY3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW4gb2JqZWN0IGlzIG9uIGl0J3Mgd2F5IHRvIHRoZSBwcm92aWRlZCBwb3NpdGlvbiBhbmQgaGFzIGNvbGxpc2lvblxuICAgKiBAcGFyYW0geFxuICAgKiBAcGFyYW0geVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgd2lsbEhhdmVDb2xsaXNpb25BdFBvc2l0aW9uKHBvc2l0aW9uWDogbnVtYmVyLCBwb3NpdGlvblk6IG51bWJlciwgc2NlbmVPYmplY3Q/OiBTY2VuZU9iamVjdCk6IGJvb2xlYW4ge1xuICAgIGxldCBvYmplY3QgPSB0aGlzLm9iamVjdHMuZmluZChvID0+IG8udGFyZ2V0WCA9PT0gcG9zaXRpb25YICYmIG8udGFyZ2V0WSA9PT0gcG9zaXRpb25ZICYmIG8uaGFzQ29sbGlzaW9uKTtcbiAgICBpZiAob2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBpZ25vcmUgcHJvdmlkZWQgb2JqZWN0ICh1c3VhbGx5IHNlbGYpXG4gICAgaWYgKHNjZW5lT2JqZWN0ID09PSBvYmplY3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzT3V0T2ZCb3VuZHMocG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChwb3NpdGlvblggPiB0aGlzLm1hcC53aWR0aCAtIDEgfHwgcG9zaXRpb25ZID4gdGhpcy5tYXAuaGVpZ2h0IC0gMSB8fCBwb3NpdGlvblggPCAwIHx8IHBvc2l0aW9uWSA8IDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29tYmluYXRpb24gb2YgaGFzQ29sbGlzaW9uQXRQb3NpdGlvbiBhbmQgd2lsbEhhdmVDb2xsaXNpb25BdFBvc2l0aW9uXG4gICAqIEBwYXJhbSBwb3NpdGlvblhcbiAgICogQHBhcmFtIHBvc2l0aW9uWVxuICAgKiBAcGFyYW0gc2NlbmVPYmplY3RcbiAgICogQHJldHVybnNcbiAgICovXG4gIGhhc09yV2lsbEhhdmVDb2xsaXNpb25BdFBvc2l0aW9uKHBvc2l0aW9uWDogbnVtYmVyLCBwb3NpdGlvblk6IG51bWJlciwgc2NlbmVPYmplY3Q/OiBTY2VuZU9iamVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhhc0NvbGxpc2lvbkF0UG9zaXRpb24ocG9zaXRpb25YLCBwb3NpdGlvblksIHNjZW5lT2JqZWN0KSB8fCB0aGlzLndpbGxIYXZlQ29sbGlzaW9uQXRQb3NpdGlvbihwb3NpdGlvblgsIHBvc2l0aW9uWSwgc2NlbmVPYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIGZpcnN0IG9iamVjdCBmb3VuZCBhdCB0aGUgcHJvdmlkZWQgcG9zaXRpb25cbiAgICogQHBhcmFtIHBvc2l0aW9uWFxuICAgKiBAcGFyYW0gcG9zaXRpb25ZXG4gICAqIEBwYXJhbSB0eXBlXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBnZXRPYmplY3RBdFBvc2l0aW9uKHBvc2l0aW9uWDogbnVtYmVyLCBwb3NpdGlvblk6IG51bWJlciwgdHlwZT86IGFueSk6IFNjZW5lT2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICAvLyBUT0RPKHNtZyk6IGFkZCBvcHRpb25hbCB0eXBlIGNoZWNrXG4gICAgLy8gVE9ETyhzbWcpOiB0aGlzIGlzIGEgdmVyeSBoZWF2eSBvcGVyYXRpb25cbiAgICByZXR1cm4gdGhpcy5vYmplY3RzLmZpbmQobyA9PiBvLnBvc2l0aW9uWCA9PT0gcG9zaXRpb25YICYmIG8ucG9zaXRpb25ZID09PSBwb3NpdGlvblkgJiYgby5jb2xsaXNpb25MYXllciAhPT0gQ2FudmFzQ29uc3RhbnRzLlVJX0NPTExJU0lPTl9MQVlFUik7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhbGwgb2JqZWN0cyBmb3VuZCBhdCB0aGUgcHJvdmlkZWQgcG9zaXRpb25cbiAgICogQHBhcmFtIHBvc2l0aW9uWFxuICAgKiBAcGFyYW0gcG9zaXRpb25ZXG4gICAqIEBwYXJhbSB0eXBlXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBnZXRBbGxPYmplY3RzQXRQb3NpdGlvbihwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHR5cGU/OiBhbnkpOiBTY2VuZU9iamVjdFtdIHtcbiAgICAvLyBUT0RPKHNtZyk6IGFkZCBvcHRpb25hbCB0eXBlIGNoZWNrXG4gICAgLy8gVE9ETyhzbWcpOiB0aGlzIGlzIGEgdmVyeSBoZWF2eSBvcGVyYXRpb25cbiAgICByZXR1cm4gdGhpcy5vYmplY3RzLmZpbHRlcihvID0+IG8ucG9zaXRpb25YID09PSBwb3NpdGlvblggJiYgby5wb3NpdGlvblkgPT09IHBvc2l0aW9uWSAmJiBvLmNvbGxpc2lvbkxheWVyICE9PSBDYW52YXNDb25zdGFudHMuVUlfQ09MTElTSU9OX0xBWUVSKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQWxsT2JqZWN0cygpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVtb3ZlT2JqZWN0KHRoaXMub2JqZWN0c1swXSk7XG4gICAgfVxuICAgIC8vIHRoaXMub2JqZWN0cyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVBbGxCYWNrZ3JvdW5kTGF5ZXJzKCk6IHZvaWQge1xuICAgIHRoaXMuYmFja2dyb3VuZExheWVycyA9IFtdO1xuICB9XG5cbiAgc2V0VXBSZW5kZXJpbmdDb250ZXh0cygpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSB7XG4gICAgICBiYWNrZ3JvdW5kOiBbXSxcbiAgICAgIG9iamVjdHM6IFtdLFxuICAgIH07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmFja2dyb3VuZExheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0LmJhY2tncm91bmRbaV0gPSB0aGlzLmNyZWF0ZUNhbnZhcygpLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQuYmFja2dyb3VuZFtpXS5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBDYW52YXNDb25zdGFudHMuT0JKRUNUX1JFTkRFUklOR19MQVlFUlM7IGkrKykge1xuICAgICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0Lm9iamVjdHNbaV0gPSB0aGlzLmNyZWF0ZUNhbnZhcygpLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQub2JqZWN0c1tpXS5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNhbnZhcygpOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgbGV0IGNhbnZhcyA9IFJlbmRlclV0aWxzLmNyZWF0ZUNhbnZhcyh0aGlzLm1hcC53aWR0aCwgdGhpcy5tYXAuaGVpZ2h0KTtcblxuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1Zy51aS5jYW52YXNMYXllcnMpIHtcbiAgICAgIHRoaXMuY2xpZW50LmNvbnRhaW5lci5hcHBlbmQoY2FudmFzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgZmxhZ0Zvck1hcENoYW5nZShpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5mbGFnZ2VkRm9yTWFwQ2hhbmdlID0gaW5kZXg7XG4gIH1cblxuICAvLyBUT0RPKHNtZyk6IGFsbG93IHRoaXMgdG8gaGF2ZSBhIHRpbWVyIHNldCBmb3IgaXRcbiAgY2hhbmdlTWFwKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBjbGVhbiB1cCBtYXBcbiAgICBpZiAodGhpcy5tYXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5tYXAuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIC8vIGNsZWFuIHVwIHNjZW5lXG4gICAgLy8gVE9ETyhzbWcpOiBzb21lIHNvcnQgb2Ygc2NlbmUgcmVzZXQgZnVuY3Rpb25cbiAgICB0aGlzLnJlbW92ZUFsbE9iamVjdHMoKTtcbiAgICB0aGlzLnJlbW92ZUFsbEJhY2tncm91bmRMYXllcnMoKTtcblxuICAgIC8vIHNldCB1cCBuZXcgbWFwXG4gICAgY29uc29sZS5sb2coJ1tTY2VuZV0gY2hhbmdpbmcgbWFwIHRvJywgaW5kZXgpO1xuICAgIHRoaXMubWFwID0gUmVmbGVjdC5jb25zdHJ1Y3QodGhpcy5tYXBzW2luZGV4XSwgW3RoaXMsIHRoaXMuY29udGV4dCwgdGhpcy5hc3NldHNdKTtcbiAgICB0aGlzLmJhY2tncm91bmRMYXllcnMucHVzaCguLi50aGlzLm1hcC5iYWNrZ3JvdW5kTGF5ZXJzKTtcbiAgICB0aGlzLm9iamVjdHMucHVzaCguLi50aGlzLm1hcC5vYmplY3RzKTtcblxuICAgIC8vIHNldCB1cCByZW5kZXJpbmcgY29udGV4dHNcbiAgICAvLyBjdXN0b20gcmVuZGVyZXJzIGluIG9iamVjdHMgZm9yIG1hcHMgcmVxdWlyZSB0aGlzXG4gICAgdGhpcy5zZXRVcFJlbmRlcmluZ0NvbnRleHRzKCk7XG5cbiAgICAvLyByZW1vdmUgZmxhZ1xuICAgIHRoaXMuZmxhZ2dlZEZvck1hcENoYW5nZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNoYW5nZVNjZW5lKHNjZW5lQ2xhc3M6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuY2xpZW50LmNoYW5nZVNjZW5lKHNjZW5lQ2xhc3MpO1xuICB9XG5cbiAgc2V0Q3VzdG9tUmVuZGVyZXIocmVuZGVyZXI6IEN1c3RvbVJlbmRlcmVyU2lnbmF0dXJlKTogdm9pZCB7XG4gICAgdGhpcy5jdXN0b21SZW5kZXJlciA9IHJlbmRlcmVyO1xuICB9XG5cbiAgcmVtb3ZlQ3VzdG9tZXJSZW5kZXJlcigpOiB2b2lkIHtcbiAgICB0aGlzLmN1c3RvbVJlbmRlcmVyID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogYW55KTogdm9pZCB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnROYW1lOiBzdHJpbmcsIGRldGFpbD86IGFueSk6IHZvaWQge1xuICAgIGxldCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHsgZGV0YWlsLCB9KTtcbiAgICBjb25zb2xlLmxvZygnW2Rpc3BhdGNoRXZlbnRdJywgZXZlbnQpO1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3ByaXRlQW5pbWF0aW9uIHtcbiAgdGlsZXNldDogc3RyaW5nO1xuICBkdXJhdGlvbjogbnVtYmVyOyAvLyBsZW5ndGggb2YgYW5pbWF0aW9uIGluIHNlY29uZHNcbiAgZnJhbWVzOiBTcHJpdGVBbmltYXRpb25GcmFtZVtdO1xuXG4gIGNvbnN0cnVjdG9yKHRpbGVzZXQ6IHN0cmluZywgZnJhbWVzOiBTcHJpdGVBbmltYXRpb25GcmFtZVtdKSB7XG4gICAgdGhpcy50aWxlc2V0ID0gdGlsZXNldDtcbiAgICB0aGlzLmZyYW1lcyA9IGZyYW1lcztcbiAgICB0aGlzLmR1cmF0aW9uID0gZnJhbWVzLnJlZHVjZSgoYWNjLCBmcmFtZSkgPT4gYWNjICsgZnJhbWUuZHVyYXRpb24sIDApO1xuICB9XG5cbiAgLy8gcmV0dXJucyB0aGUgY3VycmVudCBmcmFtZSBvZiB0aGUgYW5pbWF0aW9uIGJhc2VkIG9uIHRoZSB0aW1lXG4gIGN1cnJlbnRGcmFtZSh0aW1lOiBudW1iZXIpOiBTcHJpdGVBbmltYXRpb25GcmFtZSB7XG4gICAgbGV0IGN1cnJlbnRUaW1lID0gdGltZSAlIHRoaXMuZHVyYXRpb247XG4gICAgbGV0IGN1cnJlbnREdXJhdGlvbiA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgY3VycmVudER1cmF0aW9uICs9IHRoaXMuZnJhbWVzW2ldLmR1cmF0aW9uO1xuICAgICAgaWYgKGN1cnJlbnRUaW1lIDwgY3VycmVudER1cmF0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyYW1lc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZnJhbWVzWzBdO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3ByaXRlQW5pbWF0aW9uRnJhbWUge1xuICBzcHJpdGVYOiBudW1iZXI7XG4gIHNwcml0ZVk6IG51bWJlcjtcbiAgZHVyYXRpb246IG51bWJlcjsgLy8gbGVuZ3RoIG9mIGFuaW1hdGlvbiBpbiBzZWNvbmRzXG59XG4iLCJpbXBvcnQgeyB0eXBlIFNjZW5lIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcblxuY29uc3QgREVGQVVMVF9EVVJBVElPTiA9IDE7XG5jb25zdCBERUZBVUxUX09OX0lOVEVSVkFMID0gKCk6IHZvaWQgPT4ge307XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJ2YWxPYmplY3RDb25maWcgZXh0ZW5kcyBTY2VuZU9iamVjdEJhc2VDb25maWcge1xuICBkdXJhdGlvbj86IG51bWJlcjsgLy8gZHVyYXRpb24gb2YgZWFjaCBpbnRlcnZhbCBpbiBzZWNvbmRzIChlLmcuIDEgPSAxIHNlY29uZClcbiAgb25JbnRlcnZhbD86ICgpID0+IHZvaWQ7IC8vIGZ1bmN0aW9uIHRvIGNhbGwgb24gZWFjaCBpbnRlcnZhbFxuICBvbkRlc3Ryb3k/OiAoKSA9PiB2b2lkOyAvLyBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIG9iamVjdCBpcyBkZXN0cm95ZWRcbiAgbWF4SW50ZXJ2YWxzPzogbnVtYmVyOyAvLyBtYXhpbXVtIG51bWJlciBvZiBpbnRlcnZhbHMgdG8gcnVuIGJlZm9yZSBkZXN0cm95aW5nIHRoZSBvYmplY3Rcbn1cblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCBydW5zIGEgZnVuY3Rpb24gYXQgcmVndWxhciBpbnRlcnZhbHNcbiAqL1xuZXhwb3J0IGNsYXNzIEludGVydmFsT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBwcml2YXRlIHRpbWVyID0gMDtcbiAgcHJpdmF0ZSBpbnRlcnZhbHNDb21wbGV0ZSA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWF4SW50ZXJ2YWxzOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgZHVyYXRpb246IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBvbkludGVydmFsOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIHJlYWRvbmx5IG9uRGVzdHJveT86ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHNjZW5lOiBTY2VuZSxcbiAgICBjb25maWc6IEludGVydmFsT2JqZWN0Q29uZmlnXG4gICkge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy5kdXJhdGlvbiA9IGNvbmZpZy5kdXJhdGlvbiA/PyBERUZBVUxUX0RVUkFUSU9OO1xuICAgIHRoaXMub25JbnRlcnZhbCA9IGNvbmZpZy5vbkludGVydmFsID8/IERFRkFVTFRfT05fSU5URVJWQUw7XG4gICAgdGhpcy5vbkRlc3Ryb3kgPSBjb25maWcub25EZXN0cm95ID8/IHVuZGVmaW5lZDtcbiAgICB0aGlzLm1heEludGVydmFscyA9IGNvbmZpZy5tYXhJbnRlcnZhbHM7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudGltZXIgKz0gZGVsdGE7XG5cbiAgICBpZiAodGhpcy50aW1lciA+PSB0aGlzLmR1cmF0aW9uKSB7XG4gICAgICB0aGlzLm9uSW50ZXJ2YWwoKTtcbiAgICAgIHRoaXMudGltZXIgLT0gdGhpcy5kdXJhdGlvbjsgLy8gcmVtb3ZlIHRoZSBkdXJhdGlvbiBmcm9tIHRoZSB0aW1lciByYXRoZXIgdGhhbiBzZXQgdG8gMCB0byBhdm9pZCBkcmlmdFxuXG4gICAgICB0aGlzLmludGVydmFsc0NvbXBsZXRlKys7XG5cbiAgICAgIGlmICh0aGlzLm1heEludGVydmFscyAmJiB0aGlzLmludGVydmFsc0NvbXBsZXRlID49IHRoaXMubWF4SW50ZXJ2YWxzKSB7XG4gICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0KHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub25EZXN0cm95KSB7XG4gICAgICB0aGlzLm9uRGVzdHJveSgpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnW0ludGVydmFsT2JqZWN0XSBkZXN0cm95ZWQnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgdHlwZSBTY2VuZSB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5cbmludGVyZmFjZSBDb25maWcgZXh0ZW5kcyBTY2VuZU9iamVjdEJhc2VDb25maWcge1xuICBwb3NpdGlvblg6IG51bWJlcjtcbiAgcG9zaXRpb25ZOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0aWxlc2V0OiBzdHJpbmc7XG4gIHNwcml0ZVk6IG51bWJlcjtcbiAgc3ByaXRlWDogbnVtYmVyO1xuICByZW5kZXJMYXllcj86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFNwcml0ZU9iamVjdCBleHRlbmRzIFNjZW5lT2JqZWN0IHtcbiAgaXNSZW5kZXJhYmxlID0gdHJ1ZTtcbiAgaGFzQ29sbGlzaW9uID0gZmFsc2U7XG5cbiAgdGlsZXNldDogc3RyaW5nO1xuICBzcHJpdGVYOiBudW1iZXI7XG4gIHNwcml0ZVk6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IFNjZW5lLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XG4gICAgdGhpcy50aWxlc2V0ID0gY29uZmlnLnRpbGVzZXQ7XG4gICAgdGhpcy5zcHJpdGVYID0gY29uZmlnLnNwcml0ZVg7XG4gICAgdGhpcy5zcHJpdGVZID0gY29uZmlnLnNwcml0ZVk7XG4gICAgdGhpcy5yZW5kZXJMYXllciA9IGNvbmZpZy5yZW5kZXJMYXllciA/PyAwO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbJ3Nwcml0ZXMnXSxcbiAgICAgIHRoaXMuc3ByaXRlWCxcbiAgICAgIHRoaXMuc3ByaXRlWSxcbiAgICAgIHRoaXMucG9zaXRpb25YLFxuICAgICAgdGhpcy5wb3NpdGlvblksXG4gICAgICB0aGlzLndpZHRoLFxuICAgICAgdGhpcy5oZWlnaHRcbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0aFV0aWxzIHtcbiAgLy8gaW5jbHVkaW5nIG1pbiBhbmQgbWF4XG4gIHN0YXRpYyByYW5kb21JbnRGcm9tUmFuZ2UobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLnJhbmRvbU51bWJlckZyb21SYW5nZShtaW4sIG1heCkpO1xuICB9XG5cbiAgc3RhdGljIHJhbmRvbU51bWJlckZyb21SYW5nZShtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluO1xuICB9XG5cbiAgLy8gZm9yIGFkZGluZyBhIGJpdCBvZiByYW5kb21uZXNzIHRvIGFuaW1hdGlvbiBzdGFydCB0aW1lc1xuICBzdGF0aWMgcmFuZG9tU3RhcnRpbmdEZWx0YShzZWNvbmRzPzogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChzZWNvbmRzID8/IDEpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICcuLi9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW91c2VQb3NpdGlvbiB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBleGFjdFg6IG51bWJlcjtcbiAgZXhhY3RZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNb3VzZVV0aWxzIHtcbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgbW91c2UgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcywgdGFraW5nIGludG8gYWNjb3VudCBmdWxsc2NyZWVuIG1vZGVcbiAgICogRnVsbHNjcmVlbiBtb2RlIGFkanVzdHMgdGhlIGhlaWdodCBpZiBsYW5kc2NhcGUsIG9yIHdpZHRoIGlmIHBvcnRyYWl0LCBvZiB0aGUgY2FudmFzIGVsZW1lbnQsIGJ1dCBub3QgdGhlIHBpeGVsIHNpemUgb2YgdGhlIGNhbnZhcywgc28gd2UgbmVlZCB0byBhZGp1c3QgdGhlIG1vdXNlIHBvc2l0aW9uIGFjY29yZGluZ2x5XG4gICAqIEBwYXJhbSBjYW52YXNcbiAgICogQHBhcmFtIGV2dFxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgc3RhdGljIGdldE1vdXNlUG9zaXRpb24oY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZXZlbnQ6IE1vdXNlRXZlbnQpOiBNb3VzZVBvc2l0aW9uIHtcbiAgICBsZXQgYm91bmRpbmdSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgbGV0IGFkanVzdGVkQm91bnRpbmdSZWN0ID0ge1xuICAgICAgaGVpZ2h0OiBib3VuZGluZ1JlY3QuaGVpZ2h0LFxuICAgICAgd2lkdGg6IGJvdW5kaW5nUmVjdC53aWR0aCxcbiAgICB9O1xuXG4gICAgbGV0IGFkanVzdGVkRXZlbnQgPSB7XG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcbiAgICB9O1xuXG4gICAgLy8gd2hlbiBjYW52YXMgaXMgaW4gZnVsbHNjcmVlbiBtb2RlLCB0aGUgY2FudmFzIHdpbGwgYmUgY2VudGVyZWQgaW4gdGhlIHdpbmRvdywgbWVzc2luZyB1cCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGF4aXMgdGhhdCBpc24ndCBmdWxsIHdpZHRoIG9yIGhlaWdodFxuICAgIGxldCByYXRpbzsgLy8gcmF0aW8gb2YgY2FudmFzIGVsZW1lbnQgc2l6ZSB0byBjYW52YXMgcGl4ZWwgc2l6ZVxuICAgIGlmIChjYW52YXMud2lkdGggPiBjYW52YXMuaGVpZ2h0KSB7XG4gICAgICByYXRpbyA9IGNhbnZhcy53aWR0aCAvIGJvdW5kaW5nUmVjdC53aWR0aDsgLy8gcmF0aW8gb2YgY2FudmFzIGVsZW1lbnQgc2l6ZSB0byBjYW52YXMgcGl4ZWwgc2l6ZVxuXG4gICAgICAvLyBhZGp1c3QgYm91bmRpbmcgcmVjdFxuICAgICAgYWRqdXN0ZWRCb3VudGluZ1JlY3QuaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIHJhdGlvO1xuXG4gICAgICAvLyBhZGp1c3QgY2xpY2sgcG9zaXRpb25cbiAgICAgIGxldCBhZGRpdGlvbmFsSGVpZ2h0ID0gKGJvdW5kaW5nUmVjdC5oZWlnaHQgLSBhZGp1c3RlZEJvdW50aW5nUmVjdC5oZWlnaHQpO1xuICAgICAgYWRqdXN0ZWRFdmVudC5jbGllbnRZIC09IChhZGRpdGlvbmFsSGVpZ2h0IC8gMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhdGlvID0gY2FudmFzLmhlaWdodCAvIGJvdW5kaW5nUmVjdC5oZWlnaHQ7IC8vIHJhdGlvIG9mIGNhbnZhcyBlbGVtZW50IHNpemUgdG8gY2FudmFzIHBpeGVsIHNpemVcblxuICAgICAgLy8gYWRqdXN0IGJvdW5kaW5nIHJlY3RcbiAgICAgIGFkanVzdGVkQm91bnRpbmdSZWN0LndpZHRoID0gY2FudmFzLndpZHRoIC8gcmF0aW87XG5cbiAgICAgIC8vIGFkanVzdCBjbGljayBwb3NpdGlvblxuICAgICAgbGV0IGFkZGl0aW9uYWxXaWR0aCA9IChib3VuZGluZ1JlY3Qud2lkdGggLSBhZGp1c3RlZEJvdW50aW5nUmVjdC53aWR0aCk7XG4gICAgICBhZGp1c3RlZEV2ZW50LmNsaWVudFggLT0gKGFkZGl0aW9uYWxXaWR0aCAvIDIpO1xuICAgIH1cblxuICAgIGxldCBzY2FsZVggPSBjYW52YXMud2lkdGggLyBhZGp1c3RlZEJvdW50aW5nUmVjdC53aWR0aDtcbiAgICBsZXQgc2NhbGVZID0gY2FudmFzLmhlaWdodCAvIGFkanVzdGVkQm91bnRpbmdSZWN0LmhlaWdodDtcblxuICAgIC8vIHNjYWxlIG1vdXNlIGNvb3JkaW5hdGVzIGFmdGVyIHRoZXkgaGF2ZSBiZWVuIGFkanVzdGVkIHRvIGJlIHJlbGF0aXZlIHRvIGVsZW1lbnRcbiAgICBsZXQgeCA9ICgoYWRqdXN0ZWRFdmVudC5jbGllbnRYIC0gYm91bmRpbmdSZWN0LmxlZnQpICogc2NhbGVYKSAvIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkU7XG4gICAgbGV0IHkgPSAoKGFkanVzdGVkRXZlbnQuY2xpZW50WSAtIGJvdW5kaW5nUmVjdC50b3ApICogc2NhbGVZKSAvIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IE1hdGguZmxvb3IoeCksXG4gICAgICB5OiBNYXRoLmZsb29yKHkpLFxuICAgICAgZXhhY3RYOiB4LFxuICAgICAgZXhhY3RZOiB5LFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgc2V0Q3Vyc29yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGN1cnNvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgY2FudmFzLnN0eWxlLmN1cnNvciA9IGB1cmwoXCIke2N1cnNvcn1cIiksIGF1dG9gO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0IGlzRnVsbHNjcmVlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgIT09IG51bGw7XG4gIH1cblxuICBzdGF0aWMgaXNDbGlja1dpdGhpbihtb3VzZVBvc2l0aW9uOiBNb3VzZVBvc2l0aW9uLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbW91c2VQb3NpdGlvbi5leGFjdFggPj0geCAmJlxuICAgICAgbW91c2VQb3NpdGlvbi5leGFjdFggPD0geCArIHdpZHRoICYmXG4gICAgICBtb3VzZVBvc2l0aW9uLmV4YWN0WSA+PSB5ICYmXG4gICAgICBtb3VzZVBvc2l0aW9uLmV4YWN0WSA8PSB5ICsgaGVpZ2h0XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVuZGVyVXRpbHMge1xuICBzdGF0aWMgcmVuZGVyU3ByaXRlKFxuICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBzcHJpdGVTaGVldDogSFRNTEltYWdlRWxlbWVudCxcbiAgICBzcHJpdGVYOiBudW1iZXIsXG4gICAgc3ByaXRlWTogbnVtYmVyLFxuICAgIHBvc2l0aW9uWDogbnVtYmVyLFxuICAgIHBvc2l0aW9uWTogbnVtYmVyLFxuICAgIHNwcml0ZVdpZHRoPzogbnVtYmVyLFxuICAgIHNwcml0ZUhlaWdodD86IG51bWJlcixcbiAgICBvcHRpb25zOiB7IHNjYWxlPzogbnVtYmVyOyBvcGFjaXR5PzogbnVtYmVyOyB0eXBlPzogJ3RpbGUnIHwgJ3BpeGVsJzsgcm90YXRpb24/OiBudW1iZXI7IH0gPSB7IH0gLy8gVE9ETyhzbWcpOiBpbXBsZW1lbnQgdGlsZSB2cyBwaXhlbFxuICApOiB2b2lkIHtcbiAgICBsZXQgd2lkdGggPSBzcHJpdGVXaWR0aCA/IHNwcml0ZVdpZHRoICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSA6IENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkU7XG4gICAgbGV0IGhlaWdodCA9IHNwcml0ZUhlaWdodCA/IHNwcml0ZUhlaWdodCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgOiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFO1xuICAgIGxldCBzY2FsZSA9IG9wdGlvbnMuc2NhbGUgPz8gMTsgLy8gdXNlIHRvIHNjYWxlIHRoZSBvdXRwdXRcbiAgICBsZXQgcm90YXRpb24gPSBvcHRpb25zLnJvdGF0aW9uID8/IDA7IC8vIHVzZSB0byByb3RhdGUgdGhlIG91dHB1dFxuXG4gICAgLy8gc2F2ZSB0aGUgY3VycmVudCBjb250ZXh0IGlmIHdlIG5lZWQgdG8gYXBwbHkgb3BhY2l0eSwgdGhlbiByZXN0b3JlIGl0IGFmdGVyXG4gICAgLy8gd2UgZG9uJ3QgZG8gdGhpcyBmb3IgYWxsIHJlbmRlcnMgYXMgaXQgaXMgYSBwZXJmb3JtYW5jZSBoaXRcbiAgICBsZXQgdXBkYXRlT3BhY2l0eSA9IChvcHRpb25zLm9wYWNpdHkgJiYgb3B0aW9ucy5vcGFjaXR5IDwgMSk7XG4gICAgbGV0IHVwZGF0ZVJvdGF0aW9uID0gKHJvdGF0aW9uICE9PSAwKTtcblxuICAgIGxldCBzaG91bGRTYXZlID0gKHVwZGF0ZU9wYWNpdHkgfHwgdXBkYXRlUm90YXRpb24pO1xuICAgIGlmIChzaG91bGRTYXZlKSB7XG4gICAgICBjb250ZXh0LnNhdmUoKTtcblxuICAgICAgaWYgKHVwZGF0ZU9wYWNpdHkpIHtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IE1hdGgubWF4KDAsIG9wdGlvbnMub3BhY2l0eSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh1cGRhdGVSb3RhdGlvbikge1xuICAgICAgICAvLyBUT0RPKHNtZyk6IGNvbXBsZXRlbHkgYnVzdGVkLCB3aWxsIGZpZ3VyZSBvdXQgbGF0ZXJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUocG9zaXRpb25YLCBwb3NpdGlvblkpO1xuICAgICAgICBjb250ZXh0LnJvdGF0ZSgoNDUgKiBNYXRoLlBJKSAvIDE4MCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICBzcHJpdGVTaGVldCxcbiAgICAgIHNwcml0ZVggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFLCAvLyB0cmFuc2xhdGUgc3ByaXRlIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uXG4gICAgICBzcHJpdGVZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSwgLy8gdHJhbnNsYXRlIHNwcml0ZSBwb3NpdGlvbiB0byBwaXhlbCBwb3NpdGlvblxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBNYXRoLmZsb29yKHBvc2l0aW9uWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpLCAvLyB0cmFuc2xhdGUgZ3JpZCBwb3NpdGlvbiB0byBwaXhlbCBwb3NpdGlvbiwgcm91bmRlZCB0byBuZWFyZXN0IHBpeGVsIHRvIHByZXZlbnQgYmx1cnJpbmdcbiAgICAgIE1hdGguZmxvb3IocG9zaXRpb25ZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSksIC8vIHRyYW5zbGF0ZSBncmlkIHBvc2l0aW9uIHRvIHBpeGVsIHBvc2l0aW9uLCByb3VuZGVkIHRvIG5lYXJlc3QgcGl4ZWwgdG8gcHJldmVudCBibHVycmluZ1xuICAgICAgd2lkdGggKiBzY2FsZSxcbiAgICAgIGhlaWdodCAqIHNjYWxlXG4gICAgKTtcblxuICAgIGlmIChzaG91bGRTYXZlKSB7XG4gICAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmVuZGVyU3Vic2VjdGlvbihcbiAgICBzb3VyY2U6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICBkZXN0aW5hdGlvbjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHN0YXJ0WDogbnVtYmVyLFxuICAgIHN0YXJ0WTogbnVtYmVyLFxuICAgIGVuZFg6IG51bWJlcixcbiAgICBlbmRZOiBudW1iZXJcbiAgKTogdm9pZCB7XG4gICAgbGV0IHN0YXJ0WFBpeGVsID0gTWF0aC5mbG9vcihzdGFydFggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKTtcbiAgICBsZXQgc3RhcnRZUGl4ZWwgPSBNYXRoLmZsb29yKHN0YXJ0WSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpO1xuICAgIGxldCBlbmRYUGl4ZWwgPSBNYXRoLmZsb29yKGVuZFggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKTtcbiAgICBsZXQgZW5kWVBpeGVsID0gTWF0aC5mbG9vcihlbmRZICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSk7XG5cbiAgICBkZXN0aW5hdGlvbi5kcmF3SW1hZ2UoXG4gICAgICBzb3VyY2UuY2FudmFzLFxuICAgICAgc3RhcnRYUGl4ZWwsXG4gICAgICBzdGFydFlQaXhlbCxcbiAgICAgIGVuZFhQaXhlbCAtIHN0YXJ0WFBpeGVsLFxuICAgICAgZW5kWVBpeGVsIC0gc3RhcnRZUGl4ZWwsXG4gICAgICAwLFxuICAgICAgMCxcbiAgICAgIGRlc3RpbmF0aW9uLmNhbnZhcy53aWR0aCxcbiAgICAgIGRlc3RpbmF0aW9uLmNhbnZhcy5oZWlnaHRcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIHJlbmRlckNpcmNsZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHBvc2l0aW9uWDogbnVtYmVyLCBwb3NpdGlvblk6IG51bWJlciwgb3B0aW9uczogeyBjb2xvdXI/OiBzdHJpbmc7IH0gPSB7fSk6IHZvaWQge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmMoXG4gICAgICAocG9zaXRpb25YICogQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSkgKyAoQ2FudmFzQ29uc3RhbnRzLlRJTEVfU0laRSAvIDIpLFxuICAgICAgKHBvc2l0aW9uWSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUpICsgKENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgLyAyKSxcbiAgICAgIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgLyAyLFxuICAgICAgMCxcbiAgICAgIDIgKiBNYXRoLlBJXG4gICAgKTtcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9ucy5jb2xvdXIgfHwgJ3NhZGRsZWJyb3duJztcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuXG4gIC8vIFRPRE8oc21nKTogdGhpcyBpcyB1c2luZyBhIG1peHR1cmUgb2YgcGl4ZWwgYW5kIHRpbGUgY29vcmRpbmF0ZXMsIG5lZWQgdG8gc3RhbmRhcmRpemVcbiAgc3RhdGljIGZpbGxSZWN0YW5nbGUoXG4gICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHBvc2l0aW9uWDogbnVtYmVyLFxuICAgIHBvc2l0aW9uWTogbnVtYmVyLFxuICAgIHdpZHRoOiBudW1iZXIsXG4gICAgaGVpZ2h0OiBudW1iZXIsXG4gICAgb3B0aW9uczogeyBjb2xvdXI/OiBzdHJpbmc7IHR5cGU/OiAncGl4ZWwnIHwgJ3RpbGUnOyB9ID0geyB9XG4gICk6IHZvaWQge1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBvcHRpb25zLmNvbG91ciA/IG9wdGlvbnMuY29sb3VyIDogJ2JsYWNrJztcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9wdGlvbnMuY29sb3VyID8gb3B0aW9ucy5jb2xvdXIgOiAnYmxhY2snO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5yZWN0KFxuICAgICAgTWF0aC5mbG9vcihwb3NpdGlvblggKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSwgLy8gKzAuNSB0byBwcmV2ZW50IGJsdXJyaW5nIGJ1dCB0aGF0IGNhdXNlcyBhZGRpdGlvbmFsIGlzc3Vlc1xuICAgICAgTWF0aC5mbG9vcihwb3NpdGlvblkgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFKSwgLy8gKzAuNSB0byBwcmV2ZW50IGJsdXJyaW5nIGJ1dCB0aGF0IGNhdXNlcyBhZGRpdGlvbmFsIGlzc3Vlc1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHRcbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH1cblxuICBzdGF0aWMgc3Ryb2tlUmVjdGFuZ2xlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcG9zaXRpb25YOiBudW1iZXIsIHBvc2l0aW9uWTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY29sb3VyPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIC8vIGNhbnZhcyByZW5kZXJzIG9uIGEgaGFsZiBwaXhlbCBzbyB3ZSBuZWVkIHRvIG9mZnNldCBieSAuNSBpbiBvcmRlciB0byBnZXQgdGhlIHN0cm9rZSB3aWR0aCB0byBiZSAxcHgsIG90aGVyd2lzZSBpdCB3YXMgMnB4IHdpZGUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzODc5NDAyXG4gICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgIGNvbnRleHQuc3Ryb2tlUmVjdChwb3NpdGlvblggKyAwLjUsIHBvc2l0aW9uWSArIDAuNSwgd2lkdGggLSAxLCBoZWlnaHQgLSAxKTtcbiAgfVxuXG4gIHN0YXRpYyBjbGVhckNhbnZhcyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVDYW52YXMod2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlcik6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICAvLyBjcmVhdGUgY2FudmFzXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cbiAgICAvLyBjb25maWd1cmUgY2FudmFzXG4gICAgY2FudmFzLndpZHRoID0gd2lkdGggPyB3aWR0aCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgOiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1dJRFRIO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQgPyBoZWlnaHQgKiBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFIDogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19IRUlHSFQ7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgc3RhdGljIHBvc2l0aW9uVG9QaXhlbFBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBwb3NpdGlvbiAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkU7XG4gIH1cblxuICBzdGF0aWMgcmVuZGVyVGV4dChcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHBvc2l0aW9uWDogbnVtYmVyLFxuICAgIHBvc2l0aW9uWTogbnVtYmVyLFxuICAgIG9wdGlvbnM6IHsgc2l6ZT86IG51bWJlcjsgY29sb3VyPzogc3RyaW5nOyB9ID0ge31cbiAgKTogdm9pZCB7XG4gICAgbGV0IHNpemUgPSBvcHRpb25zLnNpemUgPyBvcHRpb25zLnNpemUgOiAxNjtcbiAgICBsZXQgY29sb3VyID0gb3B0aW9ucy5jb2xvdXIgPyBvcHRpb25zLmNvbG91ciA6ICdibGFjayc7XG5cbiAgICBjb250ZXh0LmZvbnQgPSBgJHtzaXplfXB4IEhlbHZldGljYWA7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBgJHtjb2xvdXJ9YDtcbiAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgdGV4dCxcbiAgICAgIHBvc2l0aW9uWCAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUsIC8vIHRyYW5zbGF0ZSBzcHJpdGUgcG9zaXRpb24gdG8gcGl4ZWwgcG9zaXRpb25cbiAgICAgIHBvc2l0aW9uWSAqIENhbnZhc0NvbnN0YW50cy5USUxFX1NJWkUgLy8gdHJhbnNsYXRlIHNwcml0ZSBwb3NpdGlvbiB0byBwaXhlbCBwb3NpdGlvblxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgdGV4dFRvQXJyYXkoXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHdpZHRoOiBudW1iZXIsXG4gICAgb3B0aW9uczogeyBzaXplPzogbnVtYmVyOyBjb2xvdXI/OiBzdHJpbmc7IH0gPSB7fVxuICApOiBzdHJpbmdbXSB7XG4gICAgLy8gZGVmYXVsdHNcbiAgICBsZXQgc2l6ZSA9IG9wdGlvbnMuc2l6ZSA/PyAxNjtcbiAgICBsZXQgY29sb3VyID0gb3B0aW9ucy5jb2xvdXIgPz8gJ2JsYWNrJztcblxuICAgIC8vIGNvbmZpZ3VyZSBjb250ZXh0XG4gICAgbGV0IGNvbnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnRleHQuZm9udCA9IGAke3NpemV9cHggSGVsdmV0aWNhYDtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGAke2NvbG91cn1gO1xuXG4gICAgLy8gc3BsaXQgd29yZHMgdGhlbiBjcmVhdGUgbmV3IGxpbmUgb25jZSBleGNlZWRpbmcgd2lkdGhcbiAgICBsZXQgd29yZHMgPSB0ZXh0LnNwbGl0KCcgJyk7XG4gICAgbGV0IGN1cnJlbnRMaW5lID0gJyc7XG4gICAgbGV0IG91dHB1dCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHVwZGF0ZWRMaW5lID0gYCR7Y3VycmVudExpbmV9ICR7d29yZHNbaV19YDtcblxuICAgICAgLy8gd2lkdGggZXhjZWVkZWQsIGVuZCBsaW5lXG4gICAgICBpZiAoY29udGV4dC5tZWFzdXJlVGV4dCh1cGRhdGVkTGluZSkud2lkdGggPj0gd2lkdGgpIHtcbiAgICAgICAgb3V0cHV0LnB1c2godXBkYXRlZExpbmUpO1xuICAgICAgICBjdXJyZW50TGluZSA9ICcnO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZmluYWwgd29yZCwgZW5kIGxpbmVcbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggLSAxID09PSBpKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHVwZGF0ZWRMaW5lKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIG5vIGV4aXQgY29uZGl0aW9uLCBzdG9yZSBuZXcgbGluZVxuICAgICAgY3VycmVudExpbmUgPSB1cGRhdGVkTGluZS50cmltKCk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjZW5lLCB0eXBlIFNjZW5lR2xvYmFsc0Jhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZSc7XG5pbXBvcnQgeyBHQU1FX01BUCB9IGZyb20gJy4vbWFwcy9nYW1lLm1hcCc7XG5pbXBvcnQgeyB0eXBlIENsaWVudCB9IGZyb20gJ0Bjb3JlL2NsaWVudCc7XG5cbmludGVyZmFjZSBHbG9iYWxzIGV4dGVuZHMgU2NlbmVHbG9iYWxzQmFzZUNvbmZpZyB7XG4gIHNjb3JlOiBudW1iZXI7XG4gIGhpZ2hzY29yZTogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgR0FNRV9TQ0VORSBleHRlbmRzIFNjZW5lIHtcbiAgbWFwcyA9IFtcbiAgICBHQU1FX01BUFxuICBdO1xuXG4gIGdsb2JhbHM6IEdsb2JhbHM7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNsaWVudDogQ2xpZW50KSB7XG4gICAgc3VwZXIoY2xpZW50KTtcblxuICAgIHRoaXMuZ2xvYmFscy5zY29yZSA9IDUwO1xuICAgIHRoaXMuZ2xvYmFscy5oaWdoc2NvcmUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaGlnaHNjb3JlJykgPT09IG51bGwgPyAwIDogTnVtYmVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaWdoc2NvcmUnKSk7XG5cbiAgICB0aGlzLmNoYW5nZU1hcCgwKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBCYWNrZ3JvdW5kTGF5ZXIgfSBmcm9tICdAY29yZS9tb2RlbC9iYWNrZ3JvdW5kLWxheWVyJztcbmltcG9ydCB7IFNjZW5lTWFwIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtbWFwJztcbmltcG9ydCB7IHR5cGUgU2NlbmVPYmplY3QgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnLi4vZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBTcHJpdGVPYmplY3QgfSBmcm9tICdAY29yZS9vYmplY3RzL3Nwcml0ZS5vYmplY3QnO1xuaW1wb3J0IHsgUGxheWVyT2JqZWN0IH0gZnJvbSAnLi9nYW1lL29iamVjdHMvcGxheWVyLm9iamVjdCc7XG5pbXBvcnQgeyBTY29yZU9iamVjdCB9IGZyb20gJy4vZ2FtZS9vYmplY3RzL3Njb3JlLm9iamVjdCc7XG5pbXBvcnQgeyBGbG9vck9iamVjdCB9IGZyb20gJy4vZ2FtZS9vYmplY3RzL2Zsb29yLm9iamVjdCc7XG5pbXBvcnQgeyBDb250cm9sbGVyT2JqZWN0IH0gZnJvbSAnLi9nYW1lL29iamVjdHMvY29udHJvbGxlci5vYmplY3QnO1xuXG5jb25zdCBNQVBfSEVJR0hUOiBudW1iZXIgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUO1xuY29uc3QgTUFQX1dJRFRIOiBudW1iZXIgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEg7XG5cbmV4cG9ydCBjbGFzcyBHQU1FX01BUCBleHRlbmRzIFNjZW5lTWFwIHtcbiAgaGVpZ2h0ID0gTUFQX0hFSUdIVDtcbiAgd2lkdGggPSBNQVBfV0lEVEg7XG5cbiAgYmFja2dyb3VuZExheWVyczogQmFja2dyb3VuZExheWVyW10gPSBbXG5cbiAgXTtcblxuICBvYmplY3RzOiBTY2VuZU9iamVjdFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjZW5lOiBHQU1FX1NDRU5FKSB7XG4gICAgc3VwZXIoc2NlbmUpO1xuXG4gICAgLy8gU3ByaXRlIEJhY2tncm91bmQgKGFzIG9iamVjdClcbiAgICB0aGlzLm9iamVjdHMucHVzaChuZXcgU3ByaXRlT2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgIHBvc2l0aW9uWDogMCxcbiAgICAgIHBvc2l0aW9uWTogMCxcbiAgICAgIHdpZHRoOiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEgsXG4gICAgICBoZWlnaHQ6IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQsXG4gICAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgICBzcHJpdGVZOiAwLFxuICAgICAgc3ByaXRlWDogMCxcbiAgICB9KSk7XG5cbiAgICAvLyBQbGF5ZXJcbiAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllck9iamVjdCh0aGlzLnNjZW5lLCB7fSk7XG4gICAgdGhpcy5vYmplY3RzLnB1c2gocGxheWVyKTtcblxuICAgIHRoaXMub2JqZWN0cy5wdXNoKG5ldyBDb250cm9sbGVyT2JqZWN0KHRoaXMuc2NlbmUsIHsgcGxheWVyLCB9KSk7XG5cbiAgICB0aGlzLm9iamVjdHMucHVzaChuZXcgU2NvcmVPYmplY3QodGhpcy5zY2VuZSwge30pKTtcbiAgICB0aGlzLm9iamVjdHMucHVzaChuZXcgRmxvb3JPYmplY3QodGhpcy5zY2VuZSwgeyBwbGF5ZXIsIH0pKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IERFRkFVTFRfUElQRV9TUEVFRDogbnVtYmVyID0gNDtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1BMQVlFUl9HUkFWSVRZOiBudW1iZXIgPSA0ODtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1BMQVlFUl9BQ0NFTEVSQVRJT046IG51bWJlciA9IC0xMjtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1BJUEVfR0FQOiBudW1iZXIgPSAzOyAvLyBnYXAgYmV0d2VlbiBwaXBlc1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUElQRV9SRUdJT046IG51bWJlciA9IDg7IC8vIG9ubHkgZXZlciBtb3ZlIHdpdGhpbiBYIHRpbGVzXG4iLCJleHBvcnQgZW51bSBHYW1lRXZlbnRzIHtcbiAgR2FtZUlkbGUgPSAnR2FtZUlkbGUnLFxuICBHYW1lU3RhcnQgPSAnR2FtZVN0YXJ0JyxcbiAgR2FtZUVuZCA9ICdHYW1lRW5kJ1xufVxuIiwiZXhwb3J0IGNvbnN0IEJST05aRV9NRURBTF9USFJFU0hPTEQgPSAxMDtcbmV4cG9ydCBjb25zdCBTSUxWRVJfTUVEQUxfVEhSRVNIT0xEID0gMjA7XG5leHBvcnQgY29uc3QgR09MRF9NRURBTF9USFJFU0hPTEQgPSAzMDtcbmV4cG9ydCBjb25zdCBQTEFUSU5VTV9NRURBTF9USFJFU0hPTEQgPSA0MDtcblxuZXhwb3J0IHR5cGUgTWVkYWxUeXBlID0gJ3BsYXRpbnVtJyB8ICdnb2xkJyB8ICdzaWx2ZXInIHwgJ2Jyb256ZScgfCAnbm9uZSc7XG4iLCJleHBvcnQgY29uc3QgTlVNQkVSX1NQUklURVNfTUVESVVNOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICBbJzAnXTogeyBzcHJpdGVYOiA4LjUsIHNwcml0ZVk6IDE5LCB9LFxuICBbJzEnXTogeyBzcHJpdGVYOiA4LjU2MjUsIHNwcml0ZVk6IDI5LjY4NzUsIH0sXG4gIFsnMiddOiB7IHNwcml0ZVg6IDguNSwgc3ByaXRlWTogMzAuNDM3NSwgfSxcbiAgWyczJ106IHsgc3ByaXRlWDogOC4xMjUsIHNwcml0ZVk6IDMxLjE4NzUsIH0sXG4gIFsnNCddOiB7IHNwcml0ZVg6IDMxLjM3NSwgc3ByaXRlWTogLTAuMTI1LCB9LFxuICBbJzUnXTogeyBzcHJpdGVYOiAzMS4zNzUsIHNwcml0ZVk6IDAuNjI1LCB9LFxuICBbJzYnXTogeyBzcHJpdGVYOiAzMS41LCBzcHJpdGVZOiAxLjUsIH0sXG4gIFsnNyddOiB7IHNwcml0ZVg6IDMxLjUsIHNwcml0ZVk6IDIuNSwgfSxcbiAgWyc4J106IHsgc3ByaXRlWDogMTguMjUsIHNwcml0ZVk6IDE1LCB9LFxuICBbJzknXTogeyBzcHJpdGVYOiAxOS4zNzUsIHNwcml0ZVk6IDEyLjc1LCB9LFxufTtcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9TUFJJVEVTX0xBUkdFOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICBbJzAnXTogeyBzcHJpdGVYOiAzMC44NzUsIHNwcml0ZVk6IDMuNzUsIH0sXG4gIFsnMSddOiB7IHNwcml0ZVg6IDguMzUsIHNwcml0ZVk6IDI4LjQ1LCB9LFxuICBbJzInXTogeyBzcHJpdGVYOiAxOC4xMjUsIHNwcml0ZVk6IDEwLCB9LFxuICBbJzMnXTogeyBzcHJpdGVYOiAxOSwgc3ByaXRlWTogMTAsIH0sXG4gIFsnNCddOiB7IHNwcml0ZVg6IDE5Ljg3NSwgc3ByaXRlWTogMTAsIH0sXG4gIFsnNSddOiB7IHNwcml0ZVg6IDIwLjc1LCBzcHJpdGVZOiAxMCwgfSxcbiAgWyc2J106IHsgc3ByaXRlWDogMTguMTI1LCBzcHJpdGVZOiAxMS41LCB9LFxuICBbJzcnXTogeyBzcHJpdGVYOiAxOSwgc3ByaXRlWTogMTEuNSwgfSxcbiAgWyc4J106IHsgc3ByaXRlWDogMTkuODc1LCBzcHJpdGVZOiAxMS41LCB9LFxuICBbJzknXTogeyBzcHJpdGVYOiAyMC43NSwgc3ByaXRlWTogMTEuNSwgfSxcbn07XG4iLCJpbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgR2FtZUV2ZW50cyB9IGZyb20gJy4uL2NvbnN0YW50cy9ldmVudHMuY29uc3RhbnRzJztcbmltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IEludGVydmFsT2JqZWN0IH0gZnJvbSAnQGNvcmUvb2JqZWN0cy9pbnRlcnZhbC5vYmplY3QnO1xuaW1wb3J0IHsgTWF0aFV0aWxzIH0gZnJvbSAnQGNvcmUvdXRpbHMvbWF0aC51dGlscyc7XG5pbXBvcnQgeyBQaXBlT2JqZWN0IH0gZnJvbSAnLi9waXBlLm9iamVjdCc7XG5pbXBvcnQgeyBQb2ludE9iamVjdCB9IGZyb20gJy4vcG9pbnQub2JqZWN0JztcbmltcG9ydCB7IHR5cGUgUGxheWVyT2JqZWN0IH0gZnJvbSAnLi9wbGF5ZXIub2JqZWN0JztcbmltcG9ydCB7IHR5cGUgR0FNRV9TQ0VORSB9IGZyb20gJ0BmbGFwcHktYmlyZC9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lJztcbmltcG9ydCB7IFNwcml0ZU9iamVjdCB9IGZyb20gJ0Bjb3JlL29iamVjdHMvc3ByaXRlLm9iamVjdCc7XG5pbXBvcnQgeyBTY29yZUNhcmRPYmplY3QgfSBmcm9tICcuL3Njb3JlLWNhcmQub2JqZWN0JztcbmltcG9ydCB7IERFRkFVTFRfUElQRV9HQVAsIERFRkFVTFRfUElQRV9SRUdJT04gfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xufVxuXG50eXBlIHN0YXRlID0gJ2lkbGUnIHwgJ3BsYXlpbmcnIHwgJ2dhbWUtb3Zlcic7XG5cbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBzdGF0ZTogc3RhdGU7XG5cbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG5cbiAgLy8gb2JqZWN0IHJlZmVyZW5jZXNcbiAgaW50ZXJ2YWw6IEludGVydmFsT2JqZWN0O1xuICBpZGxlU3ByaXRlOiBTcHJpdGVPYmplY3Q7XG4gIHNjb3JlY2FyZDogU2NvcmVDYXJkT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMucGxheWVyID0gY29uZmlnLnBsYXllcjtcblxuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVJZGxlLCB0aGlzLm9uR2FtZUlkbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZVN0YXJ0LCB0aGlzLm9uR2FtZVN0YXJ0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVFbmQsIHRoaXMub25HYW1lRW5kLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZUlkbGUpO1xuICB9XG5cbiAgdXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgIGNhc2UgJ2lkbGUnOlxuICAgICAgICB0aGlzLnVwZGF0ZUdhbWVJZGxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZ2FtZS1vdmVyJzpcbiAgICAgICAgdGhpcy51cGRhdGVHYW1lRW5kKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lSWRsZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ2lkbGUnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhbnVwR2FtZUVuZCgpO1xuXG4gICAgdGhpcy5zdGF0ZSA9ICdpZGxlJztcblxuICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZSA9IDA7XG5cbiAgICAvLyB2YWx1ZXMgaGVyZSBhcmUgYXdrd2FyZGx5IGhhcmRjb2RlZFxuICAgIGxldCBzcHJpdGVXaWR0aCA9IDMuNjc1O1xuICAgIGxldCBzcHJpdGVIZWlnaHQgPSAzLjU7XG4gICAgdGhpcy5pZGxlU3ByaXRlID0gbmV3IFNwcml0ZU9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICBwb3NpdGlvblg6IChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggLyAyKSAtIChzcHJpdGVXaWR0aCAvIDIpICsgMC4wNSxcbiAgICAgIHBvc2l0aW9uWTogKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQgLyAyKSAtIDAuOCxcbiAgICAgIHdpZHRoOiBzcHJpdGVXaWR0aCxcbiAgICAgIGhlaWdodDogc3ByaXRlSGVpZ2h0LFxuICAgICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgICAgc3ByaXRlWDogMTguMjUsXG4gICAgICBzcHJpdGVZOiA1LjI1LFxuICAgICAgcmVuZGVyTGF5ZXI6IENhbnZhc0NvbnN0YW50cy5VSV9DT0xMSVNJT05fTEFZRVIsXG4gICAgfSk7XG4gICAgdGhpcy5zY2VuZS5hZGRPYmplY3QodGhpcy5pZGxlU3ByaXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lU3RhcnQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09ICdwbGF5aW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0gJ3BsYXlpbmcnO1xuXG4gICAgaWYgKHRoaXMuaWRsZVNwcml0ZSkge1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3RCeUlkKHRoaXMuaWRsZVNwcml0ZS5pZCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnZhbCA9IG5ldyBJbnRlcnZhbE9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICBkdXJhdGlvbjogMixcbiAgICAgIG9uSW50ZXJ2YWw6ICgpID0+IHtcbiAgICAgICAgbGV0IHJlZ2lvbiA9IERFRkFVTFRfUElQRV9SRUdJT047XG4gICAgICAgIGxldCBnYXAgPSBERUZBVUxUX1BJUEVfR0FQO1xuICAgICAgICBsZXQgbWluID0gKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQgLyAyKSAtIChyZWdpb24gLyAyKTtcbiAgICAgICAgbGV0IG1heCA9IG1pbiArIChyZWdpb24gLyAyKTtcblxuICAgICAgICBsZXQgaGVpZ2h0ID0gTWF0aFV0aWxzLnJhbmRvbU51bWJlckZyb21SYW5nZShtaW4sIG1heCk7XG5cbiAgICAgICAgLy8gUGlwZXNcbiAgICAgICAgdGhpcy5zY2VuZS5hZGRPYmplY3QobmV3IFBpcGVPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgICAgIHBsYXllcjogdGhpcy5wbGF5ZXIsXG4gICAgICAgICAgdHlwZTogJ3RvcCcsXG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgdGhpcy5zY2VuZS5hZGRPYmplY3QobmV3IFBpcGVPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgICAgIHBsYXllcjogdGhpcy5wbGF5ZXIsXG4gICAgICAgICAgdHlwZTogJ2JvdHRvbScsXG4gICAgICAgICAgaGVpZ2h0OiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC0gaGVpZ2h0IC0gZ2FwLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gcG9pbnRcbiAgICAgICAgdGhpcy5zY2VuZS5hZGRPYmplY3QobmV3IFBvaW50T2JqZWN0KHRoaXMuc2NlbmUsIHtcbiAgICAgICAgICBwbGF5ZXI6IHRoaXMucGxheWVyLFxuICAgICAgICB9KSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KHRoaXMuaW50ZXJ2YWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVFbmQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09ICdnYW1lLW92ZXInKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSAnZ2FtZS1vdmVyJztcblxuICAgIC8vIFRPRE8oc21nKTogbW92ZSBjbGVhbnVwIG9mIHByZXZpb3VzIHN0YXRlIHRvIGl0J3Mgb3duIGZ1bmN0aW9uXG4gICAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0QnlJZCh0aGlzLmludGVydmFsLmlkKTtcbiAgICB9XG5cbiAgICAvLyBzY29yZWNhcmRcbiAgICB0aGlzLnNjb3JlY2FyZCA9IG5ldyBTY29yZUNhcmRPYmplY3QodGhpcy5zY2VuZSwge30pO1xuICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KHRoaXMuc2NvcmVjYXJkKTtcblxuICAgIC8vIHNldCBoaWdoc2NvcmVcbiAgICBpZiAodGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlID4gdGhpcy5zY2VuZS5nbG9iYWxzLmhpZ2hzY29yZSkge1xuICAgICAgdGhpcy5zY2VuZS5nbG9iYWxzLmhpZ2hzY29yZSA9IHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdoaWdoc2NvcmUnLCB0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbGVhbnVwR2FtZUVuZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zY29yZWNhcmQpIHtcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0QnlJZCh0aGlzLnNjb3JlY2FyZC5pZCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlR2FtZUVuZCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2NlbmUuZ2xvYmFscy5rZXlib2FyZFsnICddICYmICF0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5rZXlib2FyZFsnICddID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSBmYWxzZTtcblxuICAgIHRoaXMuc2NlbmUuZGlzcGF0Y2hFdmVudChHYW1lRXZlbnRzLkdhbWVJZGxlKTtcbiAgfVxuXG4gIHVwZGF0ZUdhbWVJZGxlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gJiYgIXRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gPSBmYWxzZTtcbiAgICB0aGlzLnNjZW5lLmdsb2JhbHMubW91c2UuY2xpY2subGVmdCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZVN0YXJ0KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZSB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIFBsYXllck9iamVjdCB9IGZyb20gJy4vcGxheWVyLm9iamVjdCc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyBHYW1lRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVBFX1NQRUVEIH0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHRzLmNvbnN0YW50cyc7XG5cbmNvbnN0IERFRkFVTFRfUkVOREVSX0xBWUVSID0gMTA7XG5jb25zdCBTRUdNRU5UX1dJRFRIID0gMi4yNTsgLy8gd2lkdGggb2YgdGhlIGZsb29yIHNlZ21lbnRcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xufVxuXG5leHBvcnQgY2xhc3MgRmxvb3JPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG4gIHJlbmRlckxheWVyID0gREVGQVVMVF9SRU5ERVJfTEFZRVI7XG5cbiAgb2Zmc2V0OiBudW1iZXIgPSAwO1xuXG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xuXG4gIGNoZWNrQ29sbGlzaW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgbW92aW5nRmxvb3I6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IFNjZW5lLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgLy8gY29uZmlnXG4gICAgdGhpcy5wbGF5ZXIgPSBjb25maWcucGxheWVyO1xuXG4gICAgLy8gc2V0dXBcbiAgICB0aGlzLmhlaWdodCA9IDI7XG4gICAgdGhpcy53aWR0aCA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSDtcbiAgICB0aGlzLnBvc2l0aW9uWCA9IDA7XG4gICAgdGhpcy5wb3NpdGlvblkgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC0gdGhpcy5oZWlnaHQ7XG5cbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lU3RhcnQsIHRoaXMub25HYW1lU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUVuZCwgdGhpcy5vbkdhbWVPdmVyLmJpbmQodGhpcykpO1xuICB9XG5cbiAgdXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbikge1xuICAgICAgdGhpcy51cGRhdGVDaGVja0lmUGxheWVyQWJvdmVHcm91bmQoZGVsdGEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZ0Zsb29yKSB7XG4gICAgICB0aGlzLm9mZnNldCArPSBkZWx0YSAqIERFRkFVTFRfUElQRV9TUEVFRDtcbiAgICAgIHRoaXMub2Zmc2V0ICU9IFNFR01FTlRfV0lEVEg7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyRmxvb3IoY29udGV4dCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNoZWNrSWZQbGF5ZXJBYm92ZUdyb3VuZChkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGxheWVyLnBvc2l0aW9uWSArIHRoaXMucGxheWVyLmhlaWdodCA8IHRoaXMucG9zaXRpb25ZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZUVuZCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckZsb29yKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIICsgU0VHTUVOVF9XSURUSDsgaSArPSBTRUdNRU5UX1dJRFRIKSB7XG4gICAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIHRoaXMuYXNzZXRzLmltYWdlcy5zcHJpdGVzLFxuICAgICAgICAxOSxcbiAgICAgICAgMCxcbiAgICAgICAgdGhpcy5wb3NpdGlvblggKyBpIC0gdGhpcy5vZmZzZXQsXG4gICAgICAgIHRoaXMucG9zaXRpb25ZLFxuICAgICAgICBTRUdNRU5UX1dJRFRILFxuICAgICAgICB0aGlzLmhlaWdodFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZVN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tDb2xsaXNpb24gPSB0cnVlO1xuICAgIHRoaXMubW92aW5nRmxvb3IgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVPdmVyKCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tDb2xsaXNpb24gPSBmYWxzZTtcbiAgICB0aGlzLm1vdmluZ0Zsb29yID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyB0eXBlIFBsYXllck9iamVjdCB9IGZyb20gJy4vcGxheWVyLm9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIEdBTUVfU0NFTkUgfSBmcm9tICdAZmxhcHB5LWJpcmQvc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBERUZBVUxUX1BJUEVfU1BFRUQgfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzJztcbmltcG9ydCB7IEdhbWVFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMvZXZlbnRzLmNvbnN0YW50cyc7XG5cbmNvbnN0IFNQUklURVMgPSB7XG4gIFRvcEV4aXQ6IHtcbiAgICB3aWR0aDogMS42MjUsXG4gICAgaGVpZ2h0OiAwLjgxMjUsXG4gICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgIHNwcml0ZVg6IDUuMjUsXG4gICAgc3ByaXRlWTogMjAuMTg3NSxcbiAgfSxcbiAgUGlwZToge1xuICAgIHdpZHRoOiAxLjYyNSxcbiAgICBoZWlnaHQ6IDAuODEyNSxcbiAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgc3ByaXRlWDogNS4yNSxcbiAgICBzcHJpdGVZOiAyOS4zNzUsXG4gIH0sXG4gIEJvdHRvbUV4aXQ6IHtcbiAgICB3aWR0aDogMS42MjUsXG4gICAgaGVpZ2h0OiAwLjgxMjUsXG4gICAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICAgIHNwcml0ZVg6IDMuNSxcbiAgICBzcHJpdGVZOiAyOS4zNzUsXG4gIH0sXG59O1xuXG50eXBlIFBpcGVUeXBlID0gJ3RvcCcgfCAnYm90dG9tJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xuICB0eXBlOiBQaXBlVHlwZTtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuXG4gIHdpZHRoID0gMS42MjU7XG4gIHR5cGU6IFBpcGVUeXBlO1xuXG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xuXG4gIGNhbk1vdmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMucGxheWVyID0gY29uZmlnLnBsYXllcjtcbiAgICB0aGlzLnR5cGUgPSBjb25maWcudHlwZTtcbiAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XG5cbiAgICB0aGlzLnBvc2l0aW9uWSA9IHRoaXMudHlwZSA9PT0gJ3RvcCcgPyAwIDogQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAtIHRoaXMuaGVpZ2h0O1xuICAgIHRoaXMucG9zaXRpb25YID0gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIICsgMTtcblxuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVJZGxlLCB0aGlzLm9uR2FtZUlkbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUVuZCwgdGhpcy5vbkdhbWVFbmQuYmluZCh0aGlzKSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oZGVsdGEpO1xuICAgICAgdGhpcy51cGRhdGVDb2xsaWRpbmdXaXRoUGxheWVyKGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgIHRoaXMucmVuZGVyVG9wUGlwZShjb250ZXh0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICB0aGlzLnJlbmRlckJvdHRvbVBpcGUoY29udGV4dCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9zaXRpb24oZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIG1vdmUgZnJvbSBsZWZ0IG9mIHNjcmVlbiB0byB0aGUgcmlnaHRcbiAgICB0aGlzLnBvc2l0aW9uWCAtPSAoREVGQVVMVF9QSVBFX1NQRUVEICogZGVsdGEpO1xuXG4gICAgLy8gd2hlbiBvZmYgc2NyZWVuLCByZW1vdmUgcGlwZVxuICAgIGlmICh0aGlzLnBvc2l0aW9uWCA8IC0zKSB7XG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNvbGxpZGluZ1dpdGhQbGF5ZXIoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIGlmIHBsYXllciBjb2xsaWRlcyB3aXRoIHBpcGVcbiAgICBpZiAodGhpcy5pc0NvbGxpZGluZ1dpdGgodGhpcy5wbGF5ZXIpKSB7XG4gICAgICB0aGlzLnNjZW5lLmRpc3BhdGNoRXZlbnQoR2FtZUV2ZW50cy5HYW1lRW5kKTtcbiAgICB9XG5cbiAgICAvLyBpZiBwbGF5ZXIgaXMgb2ZmIHRvcCBvZiBzY3JlZW4gcGFzc2VzIG92ZXIgcGlwZVxuICAgIGlmICh0aGlzLnBsYXllci5wb3NpdGlvblkgPCAwICYmIHRoaXMuaXNXaXRoaW5Ib3Jpem9udGFsQm91bmRzKHRoaXMucGxheWVyKSkge1xuICAgICAgdGhpcy5zY2VuZS5kaXNwYXRjaEV2ZW50KEdhbWVFdmVudHMuR2FtZUVuZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJUb3BQaXBlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIC8vIHJlcGVhdCBwaXBlIHVudGlsIG9mZiBzY3JlZW5cbiAgICBmb3IgKGxldCBpID0gdGhpcy5oZWlnaHQgLSBTUFJJVEVTLkJvdHRvbUV4aXQuaGVpZ2h0OyBpID49IC0zOyBpIC09IFNQUklURVMuUGlwZS5oZWlnaHQpIHtcbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzWydzcHJpdGVzJ10sXG4gICAgICAgIFNQUklURVMuUGlwZS5zcHJpdGVYLFxuICAgICAgICBTUFJJVEVTLlBpcGUuc3ByaXRlWSxcbiAgICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICAgIHRoaXMucG9zaXRpb25ZICsgaSxcbiAgICAgICAgU1BSSVRFUy5QaXBlLndpZHRoLFxuICAgICAgICBTUFJJVEVTLlBpcGUuaGVpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbJ3Nwcml0ZXMnXSxcbiAgICAgIFNQUklURVMuQm90dG9tRXhpdC5zcHJpdGVYLFxuICAgICAgU1BSSVRFUy5Cb3R0b21FeGl0LnNwcml0ZVksXG4gICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgIHRoaXMucG9zaXRpb25ZICsgdGhpcy5oZWlnaHQgLSBTUFJJVEVTLkJvdHRvbUV4aXQuaGVpZ2h0LFxuICAgICAgU1BSSVRFUy5Cb3R0b21FeGl0LndpZHRoLFxuICAgICAgU1BSSVRFUy5Cb3R0b21FeGl0LmhlaWdodFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckJvdHRvbVBpcGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgUmVuZGVyVXRpbHMucmVuZGVyU3ByaXRlKFxuICAgICAgY29udGV4dCxcbiAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1snc3ByaXRlcyddLFxuICAgICAgU1BSSVRFUy5Ub3BFeGl0LnNwcml0ZVgsXG4gICAgICBTUFJJVEVTLlRvcEV4aXQuc3ByaXRlWSxcbiAgICAgIHRoaXMucG9zaXRpb25YLFxuICAgICAgdGhpcy5wb3NpdGlvblksXG4gICAgICBTUFJJVEVTLlRvcEV4aXQud2lkdGgsXG4gICAgICBTUFJJVEVTLlRvcEV4aXQuaGVpZ2h0XG4gICAgKTtcblxuICAgIC8vIHJlcGVhdCBwaXBlIHVudGlsIG9mZiBzY3JlZW5cbiAgICBmb3IgKGxldCBpID0gU1BSSVRFUy5Ub3BFeGl0LmhlaWdodDsgaSA8IHRoaXMuaGVpZ2h0OyBpICs9IFNQUklURVMuUGlwZS5oZWlnaHQpIHtcbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzWydzcHJpdGVzJ10sXG4gICAgICAgIFNQUklURVMuUGlwZS5zcHJpdGVYLFxuICAgICAgICBTUFJJVEVTLlBpcGUuc3ByaXRlWSxcbiAgICAgICAgdGhpcy5wb3NpdGlvblgsXG4gICAgICAgIHRoaXMucG9zaXRpb25ZICsgaSxcbiAgICAgICAgU1BSSVRFUy5QaXBlLndpZHRoLFxuICAgICAgICBTUFJJVEVTLlBpcGUuaGVpZ2h0XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lSWRsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdEJ5SWQodGhpcy5pZCk7XG4gIH1cblxuICBwcml2YXRlIG9uR2FtZUVuZCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzQ29uc3RhbnRzIH0gZnJvbSAnQGNvcmUvY29uc3RhbnRzL2NhbnZhcy5jb25zdGFudHMnO1xuaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IFNwcml0ZUFuaW1hdGlvbiB9IGZyb20gJ0Bjb3JlL21vZGVsL3Nwcml0ZS1hbmltYXRpb24nO1xuaW1wb3J0IHsgdHlwZSBHQU1FX1NDRU5FIH0gZnJvbSAnQGZsYXBweS1iaXJkL3NjZW5lcy9nYW1lL2dhbWUuc2NlbmUnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuaW1wb3J0IHsgREVGQVVMVF9QTEFZRVJfR1JBVklUWSwgREVGQVVMVF9QTEFZRVJfQUNDRUxFUkFUSU9OIH0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHRzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBHYW1lRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cy5jb25zdGFudHMnO1xuXG5jb25zdCBERUZBVUxUX0FOSU1BVElPTlM6IFJlY29yZDxzdHJpbmcsIFNwcml0ZUFuaW1hdGlvbj4gPSB7XG4gIGRlZmF1bHQ6IG5ldyBTcHJpdGVBbmltYXRpb24oJ3Nwcml0ZXMnLCBbXG4gICAgeyBzcHJpdGVYOiAwLjE4NzUsIHNwcml0ZVk6IDMwLjY4NzUsIGR1cmF0aW9uOiAwLjA2MjUsIH0sIC8vIDBcbiAgICB7IHNwcml0ZVg6IDEuOTM3NSwgc3ByaXRlWTogMzAuNjg3NSwgZHVyYXRpb246IDAuMDYyNSwgfSwgLy8gMVxuICAgIHsgc3ByaXRlWDogMy42ODc1LCBzcHJpdGVZOiAzMC42ODc1LCBkdXJhdGlvbjogMC4wNjI1LCB9LCAvLyAyXG4gICAgeyBzcHJpdGVYOiAxLjkzNzUsIHNwcml0ZVk6IDMwLjY4NzUsIGR1cmF0aW9uOiAwLjA2MjUsIH0gLy8gMVxuICBdKSxcbn07XG5cbnR5cGUgc3RhdGUgPSAnaWRsZScgfCAncGxheWluZycgfCAnZ2FtZS1vdmVyJztcblxuY29uc3QgREVGQVVMVF9SRU5ERVJfTEFZRVI6IG51bWJlciA9IDEyO1xuXG5pbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgU2NlbmVPYmplY3RCYXNlQ29uZmlnIHtcblxufVxuXG5leHBvcnQgY2xhc3MgUGxheWVyT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuICByZW5kZXJMYXllciA9IERFRkFVTFRfUkVOREVSX0xBWUVSO1xuXG4gIHdpZHRoID0gMS4wNjI1OyAvLyAxN3B4XG4gIGhlaWdodCA9IDAuNzU7IC8vIDEycHhcblxuICBzdGF0ZTogc3RhdGU7XG5cbiAgLy8gbW92ZW1lbnRcbiAgc3BlZWQ6IG51bWJlciA9IDA7XG5cbiAgLy8gYW5pbWF0aW9uc1xuICBhbmltYXRpb25FbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgYW5pbWF0aW9uczogUmVjb3JkPHN0cmluZywgU3ByaXRlQW5pbWF0aW9uPjtcbiAgYW5pbWF0aW9uID0ge1xuICAgIGluZGV4OiAwLFxuICAgIHRpbWVyOiAwLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMucG9zaXRpb25YID0gdGhpcy5zdGFydGluZ1g7XG4gICAgdGhpcy5wb3NpdGlvblkgPSB0aGlzLnN0YXJ0aW5nWTtcblxuICAgIHRoaXMuYW5pbWF0aW9ucyA9IERFRkFVTFRfQU5JTUFUSU9OUztcblxuICAgIHRoaXMuc3RhdGUgPSAncGxheWluZyc7XG5cbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lSWRsZSwgdGhpcy5vbkdhbWVJZGxlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuc2NlbmUuYWRkRXZlbnRMaXN0ZW5lcihHYW1lRXZlbnRzLkdhbWVTdGFydCwgdGhpcy5vbkdhbWVTdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnNjZW5lLmFkZEV2ZW50TGlzdGVuZXIoR2FtZUV2ZW50cy5HYW1lRW5kLCB0aGlzLm9uR2FtZU92ZXIuYmluZCh0aGlzKSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSAnaWRsZSc6XG4gICAgICAgIC8vIHRoaXMudXBkYXRlUGxheWluZyhkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGxheWluZyc6XG4gICAgICAgIHRoaXMudXBkYXRlUGxheWluZyhkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZ2FtZS1vdmVyJzpcbiAgICAgICAgdGhpcy51cGRhdGVHYW1lT3ZlcihkZWx0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUGxheWluZyhkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVHcmF2aXR5KGRlbHRhKTtcbiAgICB0aGlzLnVwZGF0ZUZsYXAoZGVsdGEpO1xuICAgIHRoaXMucG9zaXRpb25ZICs9ICh0aGlzLnNwZWVkICogZGVsdGEpO1xuICAgIHRoaXMudXBkYXRlQW5pbWF0aW9uVGltZXIoZGVsdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVHYW1lT3ZlcihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gZmFsbCB0b3dhcmRzIGdyb3VuZCBpZiBub3QgYXQgZ3JvdW5kXG4gICAgaWYgKHRoaXMucG9zaXRpb25ZID4gQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCAtIDMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNwZWVkICs9IChERUZBVUxUX1BMQVlFUl9HUkFWSVRZICogZGVsdGEpO1xuICAgIHRoaXMucG9zaXRpb25ZICs9ICh0aGlzLnNwZWVkICogZGVsdGEpO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyUGxheWVyKGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVHcmF2aXR5KGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNwZWVkICs9IChERUZBVUxUX1BMQVlFUl9HUkFWSVRZICogZGVsdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVGbGFwKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ICYmICF0aGlzLnNjZW5lLmdsb2JhbHMua2V5Ym9hcmRbJyAnXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0ID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLmtleWJvYXJkWycgJ10gPSBmYWxzZTtcblxuICAgIC8vIGlmIGZhbGxpbmcsIHJlc2V0IHNwZWVkIHRvIDBcbiAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcbiAgICAgIHRoaXMuc3BlZWQgPSAwO1xuICAgIH1cbiAgICB0aGlzLnNwZWVkICs9IERFRkFVTFRfUExBWUVSX0FDQ0VMRVJBVElPTjtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQW5pbWF0aW9uVGltZXIoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5hbmltYXRpb25FbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hbmltYXRpb24udGltZXIgPSAodGhpcy5hbmltYXRpb24udGltZXIgKyBkZWx0YSkgJSB0aGlzLmFuaW1hdGlvbnNbJ2RlZmF1bHQnXS5kdXJhdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUGxheWVyKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGxldCBhbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbnNbJ2RlZmF1bHQnXTtcbiAgICBsZXQgZnJhbWUgPSBhbmltYXRpb24uY3VycmVudEZyYW1lKHRoaXMuYW5pbWF0aW9uLnRpbWVyKTtcblxuICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgIGNvbnRleHQsXG4gICAgICB0aGlzLmFzc2V0cy5pbWFnZXNbYW5pbWF0aW9uLnRpbGVzZXRdLFxuICAgICAgZnJhbWUuc3ByaXRlWCxcbiAgICAgIGZyYW1lLnNwcml0ZVksXG4gICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgIHRoaXMucG9zaXRpb25ZLFxuICAgICAgdGhpcy53aWR0aCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHtcbiAgICAgICAgb3BhY2l0eTogdGhpcy5yZW5kZXJPcGFjaXR5LFxuICAgICAgICBzY2FsZTogdGhpcy5yZW5kZXJTY2FsZSxcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVJZGxlKCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGUgPSAnaWRsZSc7XG4gICAgdGhpcy5wb3NpdGlvblggPSB0aGlzLnN0YXJ0aW5nWDtcbiAgICB0aGlzLnBvc2l0aW9uWSA9IHRoaXMuc3RhcnRpbmdZO1xuICAgIHRoaXMuc3BlZWQgPSAwO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkdhbWVTdGFydCgpOiB2b2lkIHtcbiAgICAvLyBzdGFydCB3aXRoIHBsYXllciBtb3ZpbmcgdXB3YXJkc1xuICAgIHRoaXMuc3BlZWQgPSBERUZBVUxUX1BMQVlFUl9BQ0NFTEVSQVRJT047XG4gICAgdGhpcy5zdGF0ZSA9ICdwbGF5aW5nJztcbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lT3ZlcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlID0gJ2dhbWUtb3Zlcic7XG4gIH1cblxuICBnZXQgc3RhcnRpbmdYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggLyAyKSAtICh0aGlzLndpZHRoIC8gMik7XG4gIH1cblxuICBnZXQgc3RhcnRpbmdZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC8gMikgLSAodGhpcy5oZWlnaHQgLyAyKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NlbmVPYmplY3QsIHR5cGUgU2NlbmVPYmplY3RCYXNlQ29uZmlnIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUtb2JqZWN0JztcbmltcG9ydCB7IHR5cGUgUGxheWVyT2JqZWN0IH0gZnJvbSAnLi9wbGF5ZXIub2JqZWN0JztcbmltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgR0FNRV9TQ0VORSB9IGZyb20gJ0BmbGFwcHktYmlyZC9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lJztcbmltcG9ydCB7IEdhbWVFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMvZXZlbnRzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBERUZBVUxUX1BJUEVfU1BFRUQgfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdHMuY29uc3RhbnRzJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7XG4gIHBsYXllcjogUGxheWVyT2JqZWN0O1xufVxuXG5leHBvcnQgY2xhc3MgUG9pbnRPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG5cbiAgcGxheWVyOiBQbGF5ZXJPYmplY3Q7XG5cbiAgd2lkdGg6IG51bWJlciA9IDAuMDYyNTtcbiAgaGVpZ2h0OiBudW1iZXIgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogR0FNRV9TQ0VORSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY2VuZSwgY29uZmlnKTtcblxuICAgIHRoaXMucGxheWVyID0gY29uZmlnLnBsYXllcjtcbiAgICB0aGlzLnBvc2l0aW9uWCA9IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9XSURUSCArIDIuNjI1O1xuXG4gICAgdGhpcy5zY2VuZS5hZGRFdmVudExpc3RlbmVyKEdhbWVFdmVudHMuR2FtZUVuZCwgdGhpcy5vbkdhbWVPdmVyLmJpbmQodGhpcykpO1xuICB9XG5cbiAgdXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKGRlbHRhKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50cyhkZWx0YSk7XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG5cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9zaXRpb24oZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIG1vdmUgZnJvbSBsZWZ0IG9mIHNjcmVlbiB0byB0aGUgcmlnaHRcbiAgICB0aGlzLnBvc2l0aW9uWCAtPSAoREVGQVVMVF9QSVBFX1NQRUVEICogZGVsdGEpO1xuXG4gICAgLy8gd2hlbiBvZmYgc2NyZWVuLCByZW1vdmUgcGlwZVxuICAgIGlmICh0aGlzLnBvc2l0aW9uWCA8IC0zKSB7IC8vIDMgaXMgYXJiaXRyYXJ5IGhlcmUsIGNvdWxkIGJlIGEgYmV0dGVyIHZhbHVlXG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvaW50cyhkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucG9zaXRpb25YIDwgdGhpcy5wbGF5ZXIucG9zaXRpb25YKSB7XG4gICAgICB0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUrKztcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25HYW1lT3ZlcigpOiB2b2lkIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZU9iamVjdEJ5SWQodGhpcy5pZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIEdBTUVfU0NFTkUgfSBmcm9tICdAZmxhcHB5LWJpcmQvc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBTcHJpdGVPYmplY3QgfSBmcm9tICdAY29yZS9vYmplY3RzL3Nwcml0ZS5vYmplY3QnO1xuaW1wb3J0IHsgTlVNQkVSX1NQUklURVNfTUVESVVNIH0gZnJvbSAnLi4vY29uc3RhbnRzL3Nwcml0ZS5jb25zdGFudHMnO1xuaW1wb3J0IHsgUmVuZGVyVXRpbHMgfSBmcm9tICdAY29yZS91dGlscy9yZW5kZXIudXRpbHMnO1xuaW1wb3J0IHsgQlJPTlpFX01FREFMX1RIUkVTSE9MRCwgR09MRF9NRURBTF9USFJFU0hPTEQsIHR5cGUgTWVkYWxUeXBlLCBQTEFUSU5VTV9NRURBTF9USFJFU0hPTEQsIFNJTFZFUl9NRURBTF9USFJFU0hPTEQgfSBmcm9tICcuLi9jb25zdGFudHMvbWVkYWwuY29uc3RhbnRzJztcblxuY29uc3QgTUVEQUxfU1BSSVRFUyA9IHtcbiAgYnJvbnplOiB7IHNwcml0ZVg6IDcsIHNwcml0ZVk6IDI5Ljc1LCB9LFxuICBzaWx2ZXI6IHsgc3ByaXRlWDogNywgc3ByaXRlWTogMjguMjUsIH0sXG4gIGdvbGQ6IHsgc3ByaXRlWDogNy41LCBzcHJpdGVZOiAxNy41LCB9LFxuICBwbGF0aW51bTogeyBzcHJpdGVYOiA3LjUsIHNwcml0ZVk6IDE2LCB9LFxufTtcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7fVxuXG5leHBvcnQgY2xhc3MgU2NvcmVDYXJkT2JqZWN0IGV4dGVuZHMgU2NlbmVPYmplY3Qge1xuICBpc1JlbmRlcmFibGUgPSB0cnVlO1xuICByZW5kZXJMYXllciA9IENhbnZhc0NvbnN0YW50cy5VSV9DT0xMSVNJT05fTEFZRVI7XG5cbiAgLy8gb2JqZWN0IHJlZmVyZW5jZXNcbiAgYmFja2dyb3VuZDogU3ByaXRlT2JqZWN0O1xuICBtZWRhbDogU3ByaXRlT2JqZWN0O1xuICBoaWdoc2NvcmU6IFNwcml0ZU9iamVjdDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IEdBTUVfU0NFTkUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc2NlbmUsIGNvbmZpZyk7XG5cbiAgICAvLyBiYWNrZ3JvdW5kXG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5jcmVhdGVCYWNrZ3JvdW5kKCk7XG4gICAgdGhpcy5zY2VuZS5hZGRPYmplY3QodGhpcy5iYWNrZ3JvdW5kKTtcblxuICAgIC8vIG1lZGFsXG4gICAgaWYgKHRoaXMubWVkYWxUeXBlICE9PSAnbm9uZScpIHtcbiAgICAgIHRoaXMubWVkYWwgPSB0aGlzLmNyZWF0ZU1lZGFsKHRoaXMubWVkYWxUeXBlKTtcbiAgICAgIHRoaXMuc2NlbmUuYWRkT2JqZWN0KHRoaXMubWVkYWwpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlclNjb3JlKGNvbnRleHQpO1xuICAgIHRoaXMucmVuZGVyU2NvcmVIaWdoc2NvcmUoY29udGV4dCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUJhY2tncm91bmQoKTogU3ByaXRlT2JqZWN0IHtcbiAgICBsZXQgc3ByaXRlV2lkdGggPSA3LjU7XG4gICAgbGV0IHNwcml0ZUhlaWdodCA9IDQ7XG5cbiAgICByZXR1cm4gbmV3IFNwcml0ZU9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICBwb3NpdGlvblg6IENhbnZhc0NvbnN0YW50cy5DQU5WQVNfQ0VOVEVSX1RJTEVfWCAtIChzcHJpdGVXaWR0aCAvIDIpLFxuICAgICAgcG9zaXRpb25ZOiBDYW52YXNDb25zdGFudHMuQ0FOVkFTX0NFTlRFUl9USUxFX1kgLSAoc3ByaXRlSGVpZ2h0IC8gMiksXG4gICAgICB3aWR0aDogc3ByaXRlV2lkdGgsXG4gICAgICBoZWlnaHQ6IHNwcml0ZUhlaWdodCxcbiAgICAgIHRpbGVzZXQ6ICdzcHJpdGVzJyxcbiAgICAgIHNwcml0ZVg6IDAsXG4gICAgICBzcHJpdGVZOiAxNixcbiAgICAgIHJlbmRlckxheWVyOiBDYW52YXNDb25zdGFudHMuVUlfQ09MTElTSU9OX0xBWUVSLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVNZWRhbChtZWRhbDogTWVkYWxUeXBlKTogU3ByaXRlT2JqZWN0IHtcbiAgICBsZXQgc3ByaXRlV2lkdGggPSAxLjU7XG4gICAgbGV0IHNwcml0ZUhlaWdodCA9IDEuNTtcblxuICAgIGlmIChtZWRhbCA9PT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTcHJpdGVPYmplY3QodGhpcy5zY2VuZSwge1xuICAgICAgcG9zaXRpb25YOiB0aGlzLmJhY2tncm91bmQucG9zaXRpb25YICsgMSxcbiAgICAgIHBvc2l0aW9uWTogdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uWSArIDEuMzc1LFxuICAgICAgd2lkdGg6IHNwcml0ZVdpZHRoLFxuICAgICAgaGVpZ2h0OiBzcHJpdGVIZWlnaHQsXG4gICAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgICBzcHJpdGVYOiBNRURBTF9TUFJJVEVTW21lZGFsXS5zcHJpdGVYLFxuICAgICAgc3ByaXRlWTogTUVEQUxfU1BSSVRFU1ttZWRhbF0uc3ByaXRlWSxcbiAgICAgIHJlbmRlckxheWVyOiBDYW52YXNDb25zdGFudHMuVUlfQ09MTElTSU9OX0xBWUVSLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTY29yZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBsZXQgc2NvcmUgPSB0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG5cbiAgICBsZXQgcG9zaXRpb25YID0gdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uWCArIHRoaXMuYmFja2dyb3VuZC53aWR0aCAtIDEuNTtcbiAgICBsZXQgcG9zaXRpb25ZID0gdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uWSArIDEuMTI1O1xuXG4gICAgbGV0IHNwcml0ZVdpZHRoID0gMC41O1xuICAgIGxldCB4T2Zmc2V0ID0gMC4wNjI1O1xuICAgIGxldCBzcHJpdGVIZWlnaHQgPSAwLjc1O1xuXG4gICAgbGV0IHN0YXJ0ID0gKHNjb3JlLmxlbmd0aCAtIDEpICogKHNwcml0ZVdpZHRoICsgeE9mZnNldCk7XG5cbiAgICBzY29yZS5mb3JFYWNoKChkaWdpdCwgaW5kZXgpID0+IHtcbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzLnNwcml0ZXMsXG4gICAgICAgIE5VTUJFUl9TUFJJVEVTX01FRElVTVtkaWdpdF0uc3ByaXRlWCxcbiAgICAgICAgTlVNQkVSX1NQUklURVNfTUVESVVNW2RpZ2l0XS5zcHJpdGVZLFxuICAgICAgICAocG9zaXRpb25YIC0gc3RhcnQpICsgKChzcHJpdGVXaWR0aCArIHhPZmZzZXQpICogaW5kZXgpLFxuICAgICAgICBwb3NpdGlvblksXG4gICAgICAgIHNwcml0ZVdpZHRoLFxuICAgICAgICBzcHJpdGVIZWlnaHRcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclNjb3JlSGlnaHNjb3JlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIGxldCBzY29yZSA9IHRoaXMuc2NlbmUuZ2xvYmFscy5oaWdoc2NvcmUudG9TdHJpbmcoKS5zcGxpdCgnJyk7XG5cbiAgICBsZXQgcG9zaXRpb25YID0gdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uWCArIHRoaXMuYmFja2dyb3VuZC53aWR0aCAtIDEuNTtcbiAgICBsZXQgcG9zaXRpb25ZID0gdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uWSArIDEuMTI1O1xuXG4gICAgbGV0IHNwcml0ZVdpZHRoID0gMC41O1xuICAgIGxldCB4T2Zmc2V0ID0gMC4wNjI1O1xuICAgIGxldCBzcHJpdGVIZWlnaHQgPSAwLjc1O1xuXG4gICAgbGV0IHN0YXJ0ID0gKHNjb3JlLmxlbmd0aCAtIDEpICogKHNwcml0ZVdpZHRoICsgeE9mZnNldCk7XG5cbiAgICBzY29yZS5mb3JFYWNoKChkaWdpdCwgaW5kZXgpID0+IHtcbiAgICAgIFJlbmRlclV0aWxzLnJlbmRlclNwcml0ZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzLnNwcml0ZXMsXG4gICAgICAgIE5VTUJFUl9TUFJJVEVTX01FRElVTVtkaWdpdF0uc3ByaXRlWCxcbiAgICAgICAgTlVNQkVSX1NQUklURVNfTUVESVVNW2RpZ2l0XS5zcHJpdGVZLFxuICAgICAgICAocG9zaXRpb25YIC0gc3RhcnQpICsgKChzcHJpdGVXaWR0aCArIHhPZmZzZXQpICogaW5kZXgpLFxuICAgICAgICBwb3NpdGlvblkgKyAxLjUsXG4gICAgICAgIHNwcml0ZVdpZHRoLFxuICAgICAgICBzcHJpdGVIZWlnaHRcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgbWVkYWxUeXBlKCk6IE1lZGFsVHlwZSB7XG4gICAgaWYgKHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZSA+PSBQTEFUSU5VTV9NRURBTF9USFJFU0hPTEQpIHtcbiAgICAgIHJldHVybiAncGxhdGludW0nO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjZW5lLmdsb2JhbHMuc2NvcmUgPj0gR09MRF9NRURBTF9USFJFU0hPTEQpIHtcbiAgICAgIHJldHVybiAnZ29sZCc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZSA+PSBTSUxWRVJfTUVEQUxfVEhSRVNIT0xEKSB7XG4gICAgICByZXR1cm4gJ3NpbHZlcic7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2NlbmUuZ2xvYmFscy5zY29yZSA+PSBCUk9OWkVfTUVEQUxfVEhSRVNIT0xEKSB7XG4gICAgICByZXR1cm4gJ2Jyb256ZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuICdub25lJztcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zY2VuZS5yZW1vdmVPYmplY3RCeUlkKHRoaXMuYmFja2dyb3VuZC5pZCk7XG4gICAgaWYgKHRoaXMubWVkYWwpIHtcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlT2JqZWN0QnlJZCh0aGlzLm1lZGFsLmlkKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IFNjZW5lT2JqZWN0LCB0eXBlIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIEdBTUVfU0NFTkUgfSBmcm9tICdAZmxhcHB5LWJpcmQvc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5pbXBvcnQgeyBOVU1CRVJfU1BSSVRFU19MQVJHRSB9IGZyb20gJy4uL2NvbnN0YW50cy9zcHJpdGUuY29uc3RhbnRzJztcblxuaW50ZXJmYWNlIENvbmZpZyBleHRlbmRzIFNjZW5lT2JqZWN0QmFzZUNvbmZpZyB7fVxuXG5leHBvcnQgY2xhc3MgU2NvcmVPYmplY3QgZXh0ZW5kcyBTY2VuZU9iamVjdCB7XG4gIGlzUmVuZGVyYWJsZSA9IHRydWU7XG4gIHJlbmRlckxheWVyID0gQ2FudmFzQ29uc3RhbnRzLlVJX0NPTExJU0lPTl9MQVlFUjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IEdBTUVfU0NFTkUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc2NlbmUsIGNvbmZpZyk7XG4gIH1cblxuICByZW5kZXIoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgbGV0IHNjb3JlID0gdGhpcy5zY2VuZS5nbG9iYWxzLnNjb3JlLnRvU3RyaW5nKCkuc3BsaXQoJycpO1xuXG4gICAgc2NvcmUuZm9yRWFjaCgoZGlnaXQsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgb2Zmc2V0ID0gZGlnaXQgPT09ICcxJyA/IDAuMTYgOiAwOyAvLyB0aGUgMSBzcHJpdGUgaW4gdGhlIHNoZWV0IGlzIGEgYml0IG9mZiBzbyBtYW51YWxseSBhZGp1c3RpbmcgaXQgcmF0aGVyIHRoYW4gYWx0ZXJpbmcgdGhlIHNwcml0ZSBzaGVldFxuXG4gICAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIHRoaXMuYXNzZXRzLmltYWdlcy5zcHJpdGVzLFxuICAgICAgICBOVU1CRVJfU1BSSVRFU19MQVJHRVtkaWdpdF0uc3ByaXRlWCxcbiAgICAgICAgTlVNQkVSX1NQUklURVNfTEFSR0VbZGlnaXRdLnNwcml0ZVksXG4gICAgICAgIChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggLyAyKSAtIChzY29yZS5sZW5ndGggLyAyKSArIGluZGV4ICsgb2Zmc2V0LFxuICAgICAgICBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUIC8gOCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAxLjEyNVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgdHlwZSBDbGllbnQgfSBmcm9tICdAY29yZS9jbGllbnQnO1xuaW1wb3J0IHsgU2NlbmUgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZSc7XG5pbXBvcnQgeyBNQUlOX01FTlVfTUFQIH0gZnJvbSAnLi9tYXBzL21haW4tbWVudS5tYXAnO1xuXG5leHBvcnQgY2xhc3MgTUFJTl9NRU5VX1NDRU5FIGV4dGVuZHMgU2NlbmUge1xuICBtYXBzID0gW1xuICAgIE1BSU5fTUVOVV9NQVBcbiAgXTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY2xpZW50OiBDbGllbnQpIHtcbiAgICBzdXBlcihjbGllbnQpO1xuICAgIHRoaXMuY2hhbmdlTWFwKDApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyB0eXBlIEJhY2tncm91bmRMYXllciB9IGZyb20gJ0Bjb3JlL21vZGVsL2JhY2tncm91bmQtbGF5ZXInO1xuaW1wb3J0IHsgU2NlbmVNYXAgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1tYXAnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZU9iamVjdCB9IGZyb20gJ0Bjb3JlL21vZGVsL3NjZW5lLW9iamVjdCc7XG5pbXBvcnQgeyBNQUlOX01FTlVfQkFDS0dST1VORF9MQVlFUl8xIH0gZnJvbSAnLi9tYWluLW1lbnUvYmFja2dyb3VuZHMvbGF5ZXIuMSc7XG5pbXBvcnQgeyBTdGFydEJ1dHRvbk9iamVjdCB9IGZyb20gJy4vbWFpbi1tZW51L29iamVjdHMvc3RhcnQtYnV0dG9uLm9iamVjdCc7XG5pbXBvcnQgeyB0eXBlIE1BSU5fTUVOVV9TQ0VORSB9IGZyb20gJy4uL21haW4tbWVudS5zY2VuZSc7XG5pbXBvcnQgeyBTcHJpdGVPYmplY3QgfSBmcm9tICdAY29yZS9vYmplY3RzL3Nwcml0ZS5vYmplY3QnO1xuXG5jb25zdCBNQVBfSEVJR0hUOiBudW1iZXIgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfSEVJR0hUO1xuY29uc3QgTUFQX1dJRFRIOiBudW1iZXIgPSBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEg7XG5cbmV4cG9ydCBjbGFzcyBNQUlOX01FTlVfTUFQIGV4dGVuZHMgU2NlbmVNYXAge1xuICBoZWlnaHQgPSBNQVBfSEVJR0hUO1xuICB3aWR0aCA9IE1BUF9XSURUSDtcblxuICBiYWNrZ3JvdW5kTGF5ZXJzOiBCYWNrZ3JvdW5kTGF5ZXJbXSA9IFtcbiAgICBNQUlOX01FTlVfQkFDS0dST1VORF9MQVlFUl8xXG4gIF07XG5cbiAgb2JqZWN0czogU2NlbmVPYmplY3RbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2VuZTogTUFJTl9NRU5VX1NDRU5FKSB7XG4gICAgc3VwZXIoc2NlbmUpO1xuXG4gICAgdGhpcy5vYmplY3RzLnB1c2gobmV3IFN0YXJ0QnV0dG9uT2JqZWN0KHRoaXMuc2NlbmUsIHt9KSk7XG5cbiAgICAvLyBsb2dvXG4gICAgbGV0IGxvZ29XaWR0aCA9IDY7XG4gICAgbGV0IGxvZ29IZWlnaHQgPSAxLjg7XG4gICAgdGhpcy5vYmplY3RzLnB1c2gobmV3IFNwcml0ZU9iamVjdCh0aGlzLnNjZW5lLCB7XG4gICAgICBwb3NpdGlvblg6IChDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggLyAyKSAtIChsb2dvV2lkdGggLyAyKSxcbiAgICAgIHBvc2l0aW9uWTogMyxcbiAgICAgIHdpZHRoOiBsb2dvV2lkdGgsXG4gICAgICBoZWlnaHQ6IGxvZ29IZWlnaHQsXG4gICAgICB0aWxlc2V0OiAnc3ByaXRlcycsXG4gICAgICBzcHJpdGVYOiAyMS43NSxcbiAgICAgIHNwcml0ZVk6IDUuNSxcbiAgICB9KSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IHR5cGUgQmFja2dyb3VuZExheWVyIH0gZnJvbSAnQGNvcmUvbW9kZWwvYmFja2dyb3VuZC1sYXllcic7XG5pbXBvcnQgeyB0eXBlIEJhY2tncm91bmRUaWxlIH0gZnJvbSAnQGNvcmUvbW9kZWwvYmFja2dyb3VuZC10aWxlJztcblxuY29uc3QgQkFTRV9USUxFOiBCYWNrZ3JvdW5kVGlsZSA9IHtcbiAgdGlsZXNldDogJ3Nwcml0ZXMnLFxuICBhbmltYXRpb25GcmFtZUR1cmF0aW9uOiAxLFxuICBhbmltYXRpb25GcmFtZXM6IFtdLFxuICBhbmltYXRpb25NYXA6IFsxXSxcbn07XG5cbmNvbnN0IFNLWTogQmFja2dyb3VuZFRpbGUgPSB7XG4gIC4uLkJBU0VfVElMRSxcbiAgYW5pbWF0aW9uRnJhbWVzOiBbXG4gICAgeyBzcHJpdGVYOiAwLCBzcHJpdGVZOiAwLCB9XG4gIF0sXG59O1xuXG5jb25zdCBDSVRZX1RSQU5TSVRJT046IEJhY2tncm91bmRUaWxlID0ge1xuICAuLi5CQVNFX1RJTEUsXG4gIGFuaW1hdGlvbkZyYW1lczogW1xuICAgIHsgc3ByaXRlWDogMCwgc3ByaXRlWTogOSwgfVxuICBdLFxufTtcblxuY29uc3QgQ0lUWTogQmFja2dyb3VuZFRpbGUgPSB7XG4gIC4uLkJBU0VfVElMRSxcbiAgYW5pbWF0aW9uRnJhbWVzOiBbXG4gICAgeyBzcHJpdGVYOiAwLCBzcHJpdGVZOiAxMCwgfVxuICBdLFxufTtcblxuY29uc3QgR1JBU1NfVFJBTlNJVElPTjogQmFja2dyb3VuZFRpbGUgPSB7XG4gIC4uLkJBU0VfVElMRSxcbiAgYW5pbWF0aW9uRnJhbWVzOiBbXG4gICAgeyBzcHJpdGVYOiAwLCBzcHJpdGVZOiAxMSwgfVxuICBdLFxufTtcblxuY29uc3QgR1JBU1M6IEJhY2tncm91bmRUaWxlID0ge1xuICAuLi5CQVNFX1RJTEUsXG4gIGFuaW1hdGlvbkZyYW1lczogW1xuICAgIHsgc3ByaXRlWDogMCwgc3ByaXRlWTogMTUsIH1cbiAgXSxcbn07XG5cbmNvbnN0IENPTFVNTjogQmFja2dyb3VuZFRpbGVbXSA9IFtcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBTS1ksXG4gIFNLWSxcbiAgU0tZLFxuICBDSVRZX1RSQU5TSVRJT04sXG4gIENJVFksXG4gIEdSQVNTX1RSQU5TSVRJT04sXG4gIEdSQVNTLFxuICBHUkFTUyxcbiAgR1JBU1Ncbl07XG5cbi8vIFRPRE8oc21nKTogYmFja2dyb3VuZCBpcyA5IHRpbGVzIHdpZGVcbmV4cG9ydCBjb25zdCBNQUlOX01FTlVfQkFDS0dST1VORF9MQVlFUl8xOiBCYWNrZ3JvdW5kTGF5ZXIgPSB7XG4gIGluZGV4OiAwLFxuICB0aWxlczogW1xuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTixcbiAgICBDT0xVTU4sXG4gICAgQ09MVU1OLFxuICAgIENPTFVNTlxuICBdLFxufTtcbiIsImltcG9ydCB7IENhbnZhc0NvbnN0YW50cyB9IGZyb20gJ0Bjb3JlL2NvbnN0YW50cy9jYW52YXMuY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgU2NlbmUgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZSc7XG5pbXBvcnQgeyBTY2VuZU9iamVjdCwgdHlwZSBTY2VuZU9iamVjdEJhc2VDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9zY2VuZS1vYmplY3QnO1xuaW1wb3J0IHsgTW91c2VVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL21vdXNlLnV0aWxzJztcbmltcG9ydCB7IEdBTUVfU0NFTkUgfSBmcm9tICdAZmxhcHB5LWJpcmQvc2NlbmVzL2dhbWUvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgeyBSZW5kZXJVdGlscyB9IGZyb20gJ0Bjb3JlL3V0aWxzL3JlbmRlci51dGlscyc7XG5cbmludGVyZmFjZSBDb25maWcgZXh0ZW5kcyBTY2VuZU9iamVjdEJhc2VDb25maWcge1xuXG59XG5cbmV4cG9ydCBjbGFzcyBTdGFydEJ1dHRvbk9iamVjdCBleHRlbmRzIFNjZW5lT2JqZWN0IHtcbiAgaXNSZW5kZXJhYmxlID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NlbmU6IFNjZW5lLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNjZW5lLCBjb25maWcpO1xuXG4gICAgdGhpcy53aWR0aCA9IDMuNTtcbiAgICB0aGlzLmhlaWdodCA9IDI7XG4gICAgdGhpcy5wb3NpdGlvblggPSAoQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX1dJRFRIIC8gMikgLSAodGhpcy53aWR0aCAvIDIpO1xuICAgIHRoaXMucG9zaXRpb25ZID0gKENhbnZhc0NvbnN0YW50cy5DQU5WQVNfVElMRV9IRUlHSFQgLyAyKSAtICh0aGlzLmhlaWdodCAvIDIpO1xuICB9XG5cbiAgdXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5jbGljay5sZWZ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5nbG9iYWxzLm1vdXNlLmNsaWNrLmxlZnQgPSBmYWxzZTtcblxuICAgIGxldCBjbGlja2VkID0gTW91c2VVdGlscy5pc0NsaWNrV2l0aGluKHRoaXMuc2NlbmUuZ2xvYmFscy5tb3VzZS5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvblgsIHRoaXMucG9zaXRpb25ZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgaWYgKCFjbGlja2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5jaGFuZ2VTY2VuZShHQU1FX1NDRU5FKTtcbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBSZW5kZXJVdGlscy5yZW5kZXJTcHJpdGUoXG4gICAgICBjb250ZXh0LFxuICAgICAgdGhpcy5hc3NldHMuaW1hZ2VzWydzcHJpdGVzJ10sXG4gICAgICAyMixcbiAgICAgIDcuMjUsXG4gICAgICB0aGlzLnBvc2l0aW9uWCxcbiAgICAgIHRoaXMucG9zaXRpb25ZLFxuICAgICAgdGhpcy53aWR0aCxcbiAgICAgIHRoaXMuaGVpZ2h0XG4gICAgKTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBDbGllbnQgfSBmcm9tICdAY29yZS9jbGllbnQnO1xuaW1wb3J0IHsgdHlwZSBBc3NldHNDb25maWcgfSBmcm9tICdAY29yZS9tb2RlbC9hc3NldHMnO1xuaW1wb3J0IHsgdHlwZSBTY2VuZUNvbnN0cnVjdG9yU2lnbmF0dXJlIH0gZnJvbSAnQGNvcmUvbW9kZWwvc2NlbmUnO1xuaW1wb3J0IHsgTUFJTl9NRU5VX1NDRU5FIH0gZnJvbSAnLi9zY2VuZXMvbWFpbi1tZW51L21haW4tbWVudS5zY2VuZSc7XG5pbXBvcnQgeyBDYW52YXNDb25zdGFudHMgfSBmcm9tICdAY29yZS9jb25zdGFudHMvY2FudmFzLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBHQU1FX1NDRU5FIH0gZnJvbSAnLi9zY2VuZXMvZ2FtZS9nYW1lLnNjZW5lJztcblxuKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogRGVjbGFyZSB5b3VyIGNhbnZhcyBjb25zdGFudHMgaGVyZVxuICAgKi9cbiAgQ2FudmFzQ29uc3RhbnRzLkNBTlZBU19USUxFX0hFSUdIVCA9IDE2O1xuICBDYW52YXNDb25zdGFudHMuQ0FOVkFTX1RJTEVfV0lEVEggPSA5O1xuICBDYW52YXNDb25zdGFudHMuVElMRV9TSVpFID0gMTY7XG5cbiAgLyoqXG4gICogQWRkIHlvdXIgc2NlbmVzIGhlcmUsIHRoZSBmaXJzdCBzY2VuZSB3aWxsIGJlIGxvYWRlZCBvbiBzdGFydHVwXG4gICovXG4gIGNvbnN0IHNjZW5lczogU2NlbmVDb25zdHJ1Y3RvclNpZ25hdHVyZVtdID0gW1xuICAgIEdBTUVfU0NFTkUsXG4gICAgTUFJTl9NRU5VX1NDRU5FXG4gIF07XG5cbiAgY29uc3QgYXNzZXRzOiBBc3NldHNDb25maWcgPSB7XG4gICAgaW1hZ2VzOiB7XG4gICAgICBzcHJpdGVzOiAnYXNzZXRzL3Nwcml0ZXMucG5nJyxcbiAgICB9LFxuICAgIGF1ZGlvOiB7fSxcbiAgfTtcblxuICB3aW5kb3cuZW5naW5lID0gbmV3IENsaWVudChcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVuZGVyLWFyZWEnKSxcbiAgICBzY2VuZXMsXG4gICAgYXNzZXRzXG4gICk7XG59KSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
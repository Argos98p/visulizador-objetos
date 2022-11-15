import React, { useRef, useEffect, forwardRef, useState, useCallback, useImperativeHandle, Fragment } from 'react';
import PropTypes from 'prop-types';
import Animated from 'animated/lib/targets/react-dom';
import Hammer from 'hammerjs';
import {useCounter} from "usehooks-ts";
import {after} from "underscore";


var styles = {"tridi-viewer":"_lqEjs","tridi-draggable-true":"_2kfM8","tridi-recording-true":"_f-Ry5","tridi-viewer-image":"_2VqNg","tridi-viewer-image-shown":"_3zqPm","tridi-viewer-image-hidden":"_1WW7u","tridi-hint-overlay":"_3Ohj5","tridi-hint":"_1Wsta","tridi-hint-text":"_14UgB","tridi-loading":"_JdKYk","load8":"_IpOvS","fadeIn":"_3uImN"};

function useInterval(callback, delay) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    var savedCallback = useRef();
    useEffect(function () {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(function () {
        function tick() {
            savedCallback.current.apply(savedCallback, args);
        }

        if (delay !== null && delay !== undefined) {
            var id = setInterval(tick, delay);
            return function () {
                return clearInterval(id);
            };
        }
    }, [delay]);
}

function useTridiKeyPressHandler(_ref) {
    var nextMove = _ref.nextMove,
        prevMove = _ref.prevMove;
    var refPrevMove = useRef();
    var refNextMove = useRef();
    useEffect(function () {
        refPrevMove.current = prevMove;
        refNextMove.current = nextMove;
    }, [nextMove, prevMove]);

    function downHandler(_ref2) {
    }

    var upHandler = function upHandler(_ref3) {
        var key = _ref3.key;
        var keyEventConfig = {
            ArrowLeft: refPrevMove,
            ArrowRight: refNextMove
        };
        var keyEventHandler = keyEventConfig[key];

        if (keyEventHandler) {
            keyEventHandler.current();
        }
    };

    useEffect(function () {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return function () {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);
}

var styles$1 = {"tridi-control-bar":"_3jUN-","tridi-control-button":"_gReMg"};

var TargetIcon = function TargetIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M21.526 13.2a9.605 9.605 0 0 1-8.326 8.326V24h-2.4v-2.474A9.605 9.605 0 0 1 2.474 13.2H0v-2.4h2.474A9.605 9.605 0 0 1 10.8 2.474V0h2.4v2.474a9.605 9.605 0 0 1 8.326 8.326H24v2.4h-2.474ZM12 19.2a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z",
        fill: "#212121"
    }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4",
        stroke: "#212121",
        strokeWidth: "2"
    }));
};

TargetIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var StopIcon = function StopIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm0 21.964c-5.502 0-9.964-4.462-9.964-9.964 0-5.502 4.462-9.964 9.964-9.964 5.502 0 9.964 4.462 9.964 9.964 0 5.502-4.462 9.964-9.964 9.964Z",
        fill: "#212121"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M15.556 8.73v6.826H8.73V8.73h6.827Zm.015-1.745H8.714a1.73 1.73 0 0 0-1.729 1.73v6.856a1.73 1.73 0 0 0 1.73 1.73h6.856a1.73 1.73 0 0 0 1.73-1.73V8.714a1.73 1.73 0 0 0-1.73-1.729Z",
        fill: "#212121",
        stroke: "#212121",
        strokeWidth: ".03"
    }));
};

StopIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var NextIcon = function NextIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m16.144 11.826-6.59-4.768a.214.214 0 0 0-.34.174v1.256c0 .274.132.533.354.694L13.463 12l-3.895 2.818a.854.854 0 0 0-.354.694v1.256c0 .174.198.276.34.174l6.59-4.768a.216.216 0 0 0 0-.348Z",
        fill: "#212121"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm0 21.964c-5.502 0-9.964-4.462-9.964-9.964 0-5.502 4.462-9.964 9.964-9.964 5.502 0 9.964 4.462 9.964 9.964 0 5.502-4.462 9.964-9.964 9.964Z",
        fill: "#212121"
    }));
};

NextIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var PauseIcon = function PauseIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm0 21.964c-5.502 0-9.964-4.462-9.964-9.964 0-5.502 4.462-9.964 9.964-9.964 5.502 0 9.964 4.462 9.964 9.964 0 5.502-4.462 9.964-9.964 9.964ZM9.643 7.714H8.357a.215.215 0 0 0-.214.215v8.142c0 .118.096.215.214.215h1.286a.215.215 0 0 0 .214-.215V7.93a.215.215 0 0 0-.214-.215Zm6 0h-1.286a.215.215 0 0 0-.214.215v8.142c0 .118.096.215.214.215h1.286a.215.215 0 0 0 .214-.215V7.93a.215.215 0 0 0-.214-.215Z",
        fill: "#212121"
    }));
};

PauseIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var PlayIcon = function PlayIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm0 21.964c-5.502 0-9.964-4.462-9.964-9.964 0-5.502 4.462-9.964 9.964-9.964 5.502 0 9.964 4.462 9.964 9.964 0 5.502-4.462 9.964-9.964 9.964Z",
        fill: "#212121"
    }), /*#__PURE__*/React.createElement("path", {
        d: "m17.555 11.655-7.93-5.76a.426.426 0 0 0-.679.346V17.76c0 .35.397.55.678.346l7.931-5.76a.426.426 0 0 0 0-.69Zm-6.9 3.589V8.756L15.121 12l-4.466 3.244Z",
        fill: "#212121"
    }));
};

PlayIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var ZoomInIcon = function ZoomInIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M15.649 9.985h-3.445V6.074a.234.234 0 0 0-.234-.234H10.22a.234.234 0 0 0-.234.234v3.911H6.541a.234.234 0 0 0-.234.234v1.751c0 .129.105.234.234.234h3.444v3.912c0 .128.106.233.234.233h1.751a.234.234 0 0 0 .234-.233v-3.912h3.444a.234.234 0 0 0 .234-.234V10.22a.234.234 0 0 0-.233-.234Zm8.29 12.377-4.262-4.261c3.564-4.347 3.316-10.787-.76-14.859-4.32-4.323-11.337-4.323-15.675 0-4.323 4.338-4.323 11.356 0 15.676 4.072 4.075 10.512 4.323 14.858.759l4.262 4.262c.094.081.243.081.322 0l1.255-1.256c.081-.078.081-.227 0-.32Zm-6.568-4.991a8.878 8.878 0 0 1-12.552 0 8.878 8.878 0 0 1 0-12.552 8.878 8.878 0 0 1 12.552 0 8.878 8.878 0 0 1 0 12.552Z",
        fill: "#212121"
    }));
};

ZoomInIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var ZoomOutIcon = function ZoomOutIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M15.649 9.985H6.54a.234.234 0 0 0-.234.234v1.751c0 .129.105.234.234.234h9.107a.234.234 0 0 0 .234-.234V10.22a.234.234 0 0 0-.233-.234Zm8.29 12.377-4.262-4.261c3.564-4.347 3.316-10.787-.76-14.859-4.32-4.323-11.337-4.323-15.675 0-4.323 4.338-4.323 11.356 0 15.676 4.072 4.075 10.512 4.323 14.858.759l4.262 4.262c.094.081.243.081.322 0l1.255-1.256c.081-.078.081-.227 0-.32Zm-6.568-4.991a8.878 8.878 0 0 1-12.552 0 8.878 8.878 0 0 1 0-12.552 8.878 8.878 0 0 1 12.552 0 8.878 8.878 0 0 1 0 12.552Z",
        fill: "#212121"
    }));
};

ZoomOutIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var MoveIcon = function MoveIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m23.92 11.83-3.828-3.02a.217.217 0 0 0-.351.17v1.942h-6.66v-6.66h1.944c.18 0 .282-.21.171-.351L12.172.083a.215.215 0 0 0-.339 0L8.81 3.911a.217.217 0 0 0 .17.351h1.941v6.66h-6.66V8.978c0-.18-.21-.282-.35-.171L.083 11.83a.214.214 0 0 0 0 .338l3.825 3.024a.217.217 0 0 0 .35-.17V13.08h6.66v6.66H8.975c-.18 0-.282.21-.171.351l3.023 3.825c.087.11.255.11.34 0l3.023-3.825a.217.217 0 0 0-.171-.351h-1.938v-6.66h6.66v1.944c0 .18.21.282.35.171l3.825-3.024a.22.22 0 0 0 .003-.341Z",
        fill: "#212121"
    }));
};

MoveIcon.defaultProps = {
    width: "24",
    height: "24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

var ControlBar = function ControlBar(_ref) {
    var isPlaying = _ref.isPlaying,
        isRecording = _ref.isRecording,
        isMoveing = _ref.isMoveing,
        setIsPlaying = _ref.setIsPlaying,
        setIsRecording = _ref.setIsRecording,
        onPlay = _ref.onPlay,
        onPause = _ref.onPause,
        onNext = _ref.onNext,
        onPrev = _ref.onPrev,
        onRecordStart = _ref.onRecordStart,
        onRecordStop = _ref.onRecordStop,
        onZoomout = _ref.onZoomout,
        onZoomin = _ref.onZoomin,
        onStartMoveing = _ref.onStartMoveing,
        onStopMoveing = _ref.onStopMoveing,
        hideRecord = _ref.hideRecord;

    var playHandler = function playHandler() {
        setIsPlaying(true);
        onPlay();
    };

    var pauseHandler = function pauseHandler() {
        setIsPlaying(false);
        onPause();
    };

    var recordStartHandler = function recordStartHandler() {
        setIsRecording(true);
        onRecordStart();
    };

    var recordStopHandler = function recordStopHandler() {
        setIsRecording(false);
        onRecordStop();
    };

    var moveStartHandler = function moveStartHandler() {
        onStartMoveing();
    };

    var moveStopHandler = function moveStopHandler() {
        onStopMoveing();
    };

    return /*#__PURE__*/React.createElement("div", {
        className: "tridi-control-bar " + styles$1['tridi-control-bar'],
        onClick: function onClick(e) {
            return e.stopPropagation();
        }
    }, !hideRecord && !isRecording && /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: recordStartHandler
    }, /*#__PURE__*/React.createElement(TargetIcon, null)), !hideRecord && isRecording && /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: recordStopHandler
    }, /*#__PURE__*/React.createElement(StopIcon, null)), !isPlaying && /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: playHandler
    }, /*#__PURE__*/React.createElement(PlayIcon, null)), isPlaying && /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: pauseHandler
    }, /*#__PURE__*/React.createElement(PauseIcon, null)), /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        style: {
            transform: 'rotate(180deg)'
        },
        onClick: onPrev
    }, /*#__PURE__*/React.createElement(NextIcon, null)), /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: onNext
    }, /*#__PURE__*/React.createElement(NextIcon, null)), /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: onZoomout
    }, /*#__PURE__*/React.createElement(ZoomOutIcon, null)), /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: onZoomin
    }, /*#__PURE__*/React.createElement(ZoomInIcon, null)), !isMoveing && /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: moveStartHandler
    }, /*#__PURE__*/React.createElement(MoveIcon, null)), isMoveing && /*#__PURE__*/React.createElement("a", {
        className: "" + styles$1['tridi-control-button'],
        onClick: moveStopHandler
    }, /*#__PURE__*/React.createElement(StopIcon, null)));
};

var styles$2 = {"tridi-dot":"_1TrFD","tridi-pin":"_1QXU8"};

var Pins = function Pins(_ref) {
    var pins = _ref.pins,
        viewerWidth = _ref.viewerWidth,
        viewerHeight = _ref.viewerHeight,
        currentFrameId = _ref.currentFrameId,
        pinWidth = _ref.pinWidth,
        pinHeight = _ref.pinHeight,
        renderPin = _ref.renderPin,
        onPinDoubleClick = _ref.onPinDoubleClick,
        onPinClick = _ref.onPinClick;

    var getPosition = function getPosition(pin) {
        if (viewerWidth >= 0 && viewerHeight >= 0) {
            return {
                left: (pin.x * 100).toFixed(3) + '%',
                marginTop: "-" + pinHeight / 2 + "px",
                marginLeft: "-" + pinWidth / 2 + "px",
                top: (pin.y * 100).toFixed(3) + '%'
            };
        }

        return {
            display: 'none'
        };
    };

    return /*#__PURE__*/React.createElement("div", {
        className: "tridi-dots-wrapper"
    }, (pins === null || pins === void 0 ? void 0 : pins.length) > 0 && pins.filter(function (pin) {
        return pin.frameId === currentFrameId;
    }).map(function (pin, index) {
        return renderPin ? /*#__PURE__*/React.createElement("div", {
            key: index,
            className: "tridi-pin " + styles$2['tridi-pin'],
            style: getPosition(pin),
            onDoubleClick: function onDoubleClick(e) {
                e.stopPropagation();
                onPinDoubleClick(pin);
            },
            onClick: function onClick(e) {
                e.stopPropagation();
                onPinClick(pin);
            }
        }, renderPin(pin)) : /*#__PURE__*/React.createElement("div", {
            key: index,
            className: "tridi-dot " + styles$2['tridi-dot'],
            style: getPosition(pin),
            onDoubleClick: function onDoubleClick(e) {
                e.stopPropagation();
                onPinDoubleClick(pin);
            },
            onClick: function onClick(e) {
                e.stopPropagation();
                onPinClick(pin);
            }
        });
    }));
};

Pins.defaultProps = {
    pins: [],
    pinWidth: 10,
    pinHeight: 10,
    onDoubleClick: function onDoubleClick() {},
    onPinClick: function onPinClick() {}
};

var styles$3 = {"tridi-status-bar":"_2_pZm"};

var StatusBar = function StatusBar(_ref) {
    var isRecording = _ref.isRecording,
        currentImageIndex = _ref.currentImageIndex;
    return /*#__PURE__*/React.createElement("div", {
        className: "tridi-status-bar " + styles$3['tridi-status-bar']
    }, /*#__PURE__*/React.createElement("div", {
        className: "status-info"
    }, /*#__PURE__*/React.createElement("span", {
        className: "info-label"
    }, "Frame Id: "), /*#__PURE__*/React.createElement("span", {
        className: "info-value"
    }, currentImageIndex)), isRecording && /*#__PURE__*/React.createElement("div", {
        className: "status-info"
    }, /*#__PURE__*/React.createElement("span", {
        className: "info-label"
    }, "Recording...")));
};

var DragIcon = function DragIcon(props) {
    return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M31.37 3.216h-9.652a.805.805 0 0 0 0 1.61h9.653a.805.805 0 0 0 0-1.61Z",
        fill: "#212121"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M31.94 3.453 28.724.235a.805.805 0 0 0-1.137 1.138l2.648 2.648-2.65 2.65a.805.805 0 0 0 1.139 1.137L31.94 4.59a.805.805 0 0 0 0-1.137ZM10.457 3.216H.805a.805.805 0 0 0 0 1.61h9.652a.805.805 0 0 0 0-1.61Z",
        fill: "#212121"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M1.942 4.02 4.59 1.374A.805.805 0 0 0 3.453.235L.235 3.453a.805.805 0 0 0 0 1.137l3.218 3.218a.808.808 0 0 0 1.137-.002.805.805 0 0 0 0-1.137L1.942 4.02Z",
        fill: "#212121"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M1.942 4.02 4.59 1.374A.805.805 0 0 0 3.453.235L.235 3.453a.805.805 0 0 0 0 1.137l3.218 3.218a.808.808 0 0 0 1.137-.002.805.805 0 0 0 0-1.137L1.942 4.02ZM27.419 10.056c-.491.099-.92.34-1.248.67a2.443 2.443 0 0 0-2.576-1.147c-.491.098-.919.34-1.248.67a2.443 2.443 0 0 0-2.576-1.147c-.435.087-.82.286-1.13.56l-.782-3.906a2.44 2.44 0 0 0-2.869-1.911 2.44 2.44 0 0 0-1.911 2.868l2.033 10.157-2.388-1.141a3.195 3.195 0 0 0-4.016 1.104 1.83 1.83 0 0 0 .508 2.535l10.212 6.806a5.45 5.45 0 0 0 4.119.814l2.8-.561a6.71 6.71 0 0 0 5.256-7.888l-1.316-6.572a2.44 2.44 0 0 0-2.868-1.91Zm2.989 8.723a5.49 5.49 0 0 1-4.3 6.453l-2.8.56a4.238 4.238 0 0 1-3.204-.632L9.891 18.354a.61.61 0 0 1-.169-.845 1.966 1.966 0 0 1 1.25-.832c.405-.08.836-.037 1.228.15l3.486 1.668a.611.611 0 0 0 .86-.67L14.275 6.474a1.22 1.22 0 0 1 2.39-.478l1.794 8.961a.61.61 0 0 0 1.195-.239l-.598-2.987a1.22 1.22 0 0 1 2.39-.479l.597 2.987A.61.61 0 0 0 23.237 14l-.358-1.792a1.22 1.22 0 0 1 2.39-.479l.358 1.793a.61.61 0 0 0 1.195-.24l-.12-.597a1.22 1.22 0 0 1 .956-1.434 1.22 1.22 0 0 1 1.434.956l1.316 6.572Z",
        fill: "#212121"
    }));
};

DragIcon.defaultProps = {
    width: "33",
    height: "30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};
var AnimatedDiv = Animated.div;

var TridiUtils = function TridiUtils() {};

TridiUtils.isValidProps = function (_ref2) {
    var images = _ref2.images,
        format = _ref2.format,
        location = _ref2.location;
    var isValid = true;

    if (!images && !format) {
        console.error("'format' property is missing or invalid. Image format must be provided for 'numbered' property.");
        isValid = false;
    }

    if (images === 'numbered' && !location) {
        console.error("'location' property is missing or invalid. Image location must be provided for 'numbered' property.");
        isValid = false;
    }

    return isValid;
};

TridiUtils.normalizedImages = function (images, format, location, count) {
    if (images === 'numbered') {
        return Array.apply(null, {
            length: count
        }).map(function (_a, index) {
            return location + "/" + (index + 1) + "." + format.toLowerCase();
        });
    }

    return images;
};

TridiUtils.uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

var Tridi = forwardRef(function (_ref, ref) {


    var className = _ref.className,
        images = _ref.images,
        pins = _ref.pins,
        pinWidth = _ref.pinWidth,
        pinHeight = _ref.pinHeight,
        setPins = _ref.setPins,
        format = _ref.format,
        location = _ref.location,
        count = _ref.count,
        draggable = _ref.draggable,
        hintOnStartup = _ref.hintOnStartup,
        hintText = _ref.hintText,
        autoplay = _ref.autoplay,
        autoplaySpeed = _ref.autoplaySpeed,
        stopAutoplayOnClick = _ref.stopAutoplayOnClick,
        stopAutoplayOnMouseEnter = _ref.stopAutoplayOnMouseEnter,
        resumeAutoplayOnMouseLeave = _ref.resumeAutoplayOnMouseLeave,
        touch = _ref.touch,
        mousewheel = _ref.mousewheel,
        inverse = _ref.inverse,
        dragInterval = _ref.dragInterval,
        touchDragInterval = _ref.touchDragInterval,
        mouseleaveDetect = _ref.mouseleaveDetect,
        showControlBar = _ref.showControlBar,
        showStatusBar = _ref.showStatusBar,
        renderPin = _ref.renderPin,
        renderHint = _ref.renderHint,
        zoom = _ref.zoom,
        onHintHide = _ref.onHintHide,
        onAutoplayStart = _ref.onAutoplayStart,
        onAutoplayStop = _ref.onAutoplayStop,
        onNextMove = _ref.onNextMove,
        onPrevMove = _ref.onPrevMove,
        onNextFrame = _ref.onNextFrame,
        onPrevFrame = _ref.onPrevFrame,
        onDragStart = _ref.onDragStart,
        onDragEnd = _ref.onDragEnd,
        onFrameChange = _ref.onFrameChange,
        onRecordStart = _ref.onRecordStart,
        onRecordStop = _ref.onRecordStop,
        onPinClick = _ref.onPinClick,
        onZoom = _ref.onZoom,
        maxZoom = _ref.maxZoom,
        minZoom = _ref.minZoom,
        hideRecord = _ref.hideRecord,
        onLoadChange = _ref.onLoadChange;

    var _useState = useState([]),
        moveBuffer = _useState[0],
        setMoveBuffer = _useState[1];

    var _useState2 = useState(hintOnStartup),
        hintVisible = _useState2[0],
        setHintVisible = _useState2[1];

    var _useState3 = useState(0),
        currentImageIndex = _useState3[0],
        setCurrentImageIndex = _useState3[1];

    var _useState4 = useState(false),
        isDragging = _useState4[0],
        setIsDragging = _useState4[1];

    var _useState5 = useState(false),
        isAutoPlayRunning = _useState5[0],
        setIsAutoPlayRunning = _useState5[1];

    var _useState6 = useState(false),
        isRecording = _useState6[0],
        setIsRecording = _useState6[1];

    var _useState7 = useState(null),
        recordingSessionId = _useState7[0],
        setRecordingSessionId = _useState7[1];

    var _useState8 = useState(false),
        isPlaying = _useState8[0],
        setIsPlaying = _useState8[1];

    var _useState9 = useState(false),
        isMoveing = _useState9[0],
        setIsMoveing = _useState9[1];

    var AnimatedValues = useRef({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        zoom: new Animated.Value(zoom),
        originZoom: 1,
        originOffset: null,
        isZooming: false
    });

    var _useState10 = useState(null),
        viewerSize = _useState10[0],
        setViewerSize = _useState10[1];

    var _count = Array.isArray(images) ? images.length : Number(count);

    var _images = TridiUtils.normalizedImages(images, format, location, _count);

    var _viewerImageRef = useRef(null);

    var _viewerZoomRef = useRef(null);

    var _draggable = !isRecording && draggable;

    var _useState11 = useState(0),
        loadedImagesCount = _useState11[0],
        setLoadedImagesCount = _useState11[1];

    var hideHint = function hideHint() {
        setHintVisible(false);
        onHintHide();
    };

    var nextFrame = useCallback(function () {
        var newIndex = currentImageIndex >= _count - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
        onNextFrame();
        onFrameChange(newIndex);
    }, [_count, currentImageIndex, onFrameChange, onNextFrame]);
    var prevFrame = useCallback(function () {
        var newIndex = currentImageIndex <= 0 ? _count - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
        onPrevFrame();
        onFrameChange(newIndex);
    }, [_count, currentImageIndex, onFrameChange, onPrevFrame]);
    var nextMove = useCallback(function () {
        onNextMove();
        return inverse ? prevFrame() : nextFrame();
    }, [inverse, nextFrame, onNextMove, prevFrame]);
    var prevMove = useCallback(function () {
        onPrevMove();
        return inverse ? nextFrame() : prevFrame();
    }, [inverse, nextFrame, onPrevMove, prevFrame]);
    var rotateViewerImage = useCallback(function (e) {
        var interval = e.touches ? touchDragInterval : dragInterval;
        var eventX = e.touches ? Math.round(e.touches[0].clientX) : e.clientX;
        var coord = eventX - _viewerImageRef.current.offsetLeft;
        var newMoveBufffer = moveBuffer;

        if (moveBuffer.length < 2) {
            newMoveBufffer = moveBuffer.concat(coord);
        } else {
            newMoveBufffer = [moveBuffer[1], coord];
        }

        setMoveBuffer(newMoveBufffer);
        var threshold = !(coord % interval);
        var oldMove = newMoveBufffer[0];
        var newMove = newMoveBufffer[1];

        if (threshold && newMove < oldMove) {
            nextMove();
        } else if (threshold && newMove > oldMove) {
            prevMove();
        }
    }, [dragInterval, moveBuffer, nextMove, prevMove, touchDragInterval]);

    var resetMoveBuffer = function resetMoveBuffer() {
        return setMoveBuffer([]);
    };

    var startDragging = useCallback(function () {
        setIsDragging(true);
        onDragStart();
    }, [onDragStart]);
    var stopDragging = useCallback(function () {
        setIsDragging(false);
        onDragEnd();
    }, [onDragEnd]);

    var _toggleAutoplay = useCallback(function (state) {
        setIsAutoPlayRunning(state);
        return state ? onAutoplayStart() : onAutoplayStop();
    }, [onAutoplayStart, onAutoplayStop]);

    var _toggleRecording = useCallback(function (state, existingSessionId) {
        setIsRecording(state);
        var sessionId = recordingSessionId || existingSessionId || TridiUtils.uid();

        if (state) {
            if (!recordingSessionId) {
                setRecordingSessionId(sessionId);
            }

            onRecordStart(sessionId);
        } else {
            setRecordingSessionId(null);
            onRecordStop(sessionId);
        }
    }, [onRecordStart, onRecordStop, recordingSessionId]);

    var resetPosition = useCallback(function () {
        console.log('resetPosition');
        AnimatedValues.current.x.setValue(0);
        AnimatedValues.current.y.setValue(0);
        AnimatedValues.current.zoom.setValue(zoom);
    }, []);

    var _toggleMoving = useCallback(function (isMoving) {
        if (isMoving) {
            _toggleRecording(false);

            setIsMoveing(true);
        } else {
            resetPosition();
            setIsMoveing(false);
        }
    }, [resetPosition, _toggleRecording]);

    var setZoom = function setZoom(zoom) {
        var newZoom = Math.max(minZoom, zoom);
        newZoom = Math.min(maxZoom, newZoom);
        AnimatedValues.current.zoom.setValue(newZoom);
        onZoom(newZoom);
    };

    var imageViewerMouseDownHandler = function imageViewerMouseDownHandler(e) {
        if (_draggable) {
            if (e.preventDefault) e.preventDefault();
            startDragging();
            rotateViewerImage(e);
        }

        if (isMoveing) {
            var clientX = e.clientX;
            var clientY = e.clientY;
            AnimatedValues.current.originOffset = {
                x: clientX - AnimatedValues.current.x._value,
                y: clientY - AnimatedValues.current.y._value
            };
        }

        if (isAutoPlayRunning && stopAutoplayOnClick) {
            _toggleAutoplay(false);
        }
    };

    var imageViewerMouseUpHandler = function imageViewerMouseUpHandler(e) {
        if (_draggable) {
            if (e.preventDefault) e.preventDefault();
            stopDragging();
            resetMoveBuffer();
        }

        AnimatedValues.current.originOffset = null;
    };

    var imageViewerMouseMoveHandler = function imageViewerMouseMoveHandler(e) {
        if (isDragging && isMoveing && AnimatedValues.current.originOffset) {
            var clientX = e.clientX;
            var clientY = e.clientY;
            AnimatedValues.current.x.setValue(clientX - AnimatedValues.current.originOffset.x);
            AnimatedValues.current.y.setValue(clientY - AnimatedValues.current.originOffset.y);
            return;
        }

        if (_draggable && isDragging) {
            rotateViewerImage(e);
        }
    };

    var imageViewerMouseLeaveHandler = function imageViewerMouseLeaveHandler() {
        if (_draggable) resetMoveBuffer();

        if (!isAutoPlayRunning && resumeAutoplayOnMouseLeave) {
            _toggleAutoplay(true);
        }

        if (mouseleaveDetect) {
            stopDragging();
            resetMoveBuffer();
        }
    };

    var imageViewerMouseEnterHandler = function imageViewerMouseEnterHandler() {
        if (isAutoPlayRunning && stopAutoplayOnMouseEnter) {
            _toggleAutoplay(false);
        }
    };

    var imageViewerWheelHandler = useCallback(function (e) {
        if (mousewheel) {
            if (e.preventDefault) e.preventDefault();
            e.deltaY / 120 > 0 ? nextMove() : prevMove();
        }
    }, [mousewheel, nextMove, prevMove]);
    var imageViewerTouchStartHandler = useCallback(function (e) {
        if (isMoveing) {
            var clientX = e.touches[0].clientX;
            var clientY = e.touches[0].clientY;
            AnimatedValues.current.originOffset = {
                x: clientX - AnimatedValues.current.x._value,
                y: clientY - AnimatedValues.current.y._value
            };
            return;
        }

        if (touch) {
            startDragging();
            rotateViewerImage(e);
        }

        if (isAutoPlayRunning && stopAutoplayOnClick) {
            _toggleAutoplay(false);
        }
    }, [isAutoPlayRunning, rotateViewerImage, startDragging, stopAutoplayOnClick, _toggleAutoplay, touch, isMoveing]);
    var imageViewerTouchMoveHandler = useCallback(function (e) {
        if (AnimatedValues.current.isZooming) {
            return;
        }

        if (isMoveing && AnimatedValues.current.originOffset) {
            var clientX = e.touches[0].clientX;
            var clientY = e.touches[0].clientY;
            AnimatedValues.current.x.setValue(clientX - AnimatedValues.current.originOffset.x);
            AnimatedValues.current.y.setValue(clientY - AnimatedValues.current.originOffset.y);
            return;
        }

        if (touch) {
            rotateViewerImage(e);
        }
    }, [rotateViewerImage, touch, isMoveing]);
    var imageViewerTouchEndHandler = useCallback(function (e) {
        AnimatedValues.current.originOffset = null;

        if (touch) {
            stopDragging();
            resetMoveBuffer();
        }

        if (!isAutoPlayRunning && resumeAutoplayOnMouseLeave) {
            _toggleAutoplay(true);
        }
    }, [isAutoPlayRunning, resumeAutoplayOnMouseLeave, stopDragging, _toggleAutoplay, touch]);

    var imageViewerClickHandler = function imageViewerClickHandler(e) {
        if (isRecording) {
            var viewerWidth = _viewerImageRef.current.clientWidth;
            var viewerHeight = _viewerImageRef.current.clientHeight;
            var clientX = (e.clientX - AnimatedValues.current.x._value - (viewerWidth - viewerWidth * AnimatedValues.current.zoom._value) / 2) / AnimatedValues.current.zoom._value;
            var clientY = (e.clientY - AnimatedValues.current.y._value - (viewerHeight - viewerHeight * AnimatedValues.current.zoom._value) / 2) / AnimatedValues.current.zoom._value;

            var viewerOffsetLeft = _viewerImageRef.current.getBoundingClientRect().left;

            var viewerOffsetTop = _viewerImageRef.current.getBoundingClientRect().top;

            var x = ((clientX - viewerOffsetLeft) / viewerWidth).toFixed(6);
            var y = ((clientY - viewerOffsetTop) / viewerHeight).toFixed(6);
            var pin = {
                id: TridiUtils.uid(),
                frameId: currentImageIndex,
                x: x,
                y: y,
                recordingSessionId: recordingSessionId
            };
            var newPins = pins.concat(pin);
            setPins(newPins);
        }
    };

    var pinDoubleClickHandler = function pinDoubleClickHandler(pin) {
        if (isRecording) {
            var newPins = pins.filter(function (item) {
                return item.id !== pin.id;
            });
            setPins(newPins);
        }
    };

    var pinClickHandler = function pinClickHandler(pin) {
        if (!isRecording) {
            onPinClick(pin);
        }
    };

    useEffect(function () {
        var viewerRef = _viewerImageRef.current;
        viewerRef.addEventListener('touchstart', imageViewerTouchStartHandler, {
            passive: false
        });
        viewerRef.addEventListener('touchmove', imageViewerTouchMoveHandler, {
            passive: false
        });
        viewerRef.addEventListener('touchend', imageViewerTouchEndHandler, {
            passive: false
        });
        viewerRef.addEventListener('wheel', imageViewerWheelHandler, {
            passive: false
        });
        return function () {
            viewerRef.removeEventListener('touchstart', imageViewerTouchStartHandler);
            viewerRef.removeEventListener('touchmove', imageViewerTouchMoveHandler);
            viewerRef.removeEventListener('touchend', imageViewerTouchEndHandler);
            viewerRef.removeEventListener('wheel', imageViewerWheelHandler);
        };
    }, [imageViewerTouchEndHandler, imageViewerTouchMoveHandler, imageViewerTouchStartHandler, imageViewerWheelHandler]);
    useEffect(function () {
        if (autoplay) {
            _toggleAutoplay(autoplay);
        }
    }, [autoplay, _toggleAutoplay]);
    useInterval(function () {
        nextMove();
    }, isAutoPlayRunning ? autoplaySpeed : null);
    useEffect(function () {
        if (zoom !== undefined && zoom !== AnimatedValues.current.zoom._value) {
            var newZoom = Math.max(minZoom, zoom);
            newZoom = Math.min(maxZoom, newZoom);
            AnimatedValues.current.zoom.setValue(newZoom);
            onZoom(newZoom);
        }
    }, [zoom, onZoom]);
    useImperativeHandle(ref, function () {
        return {
            setZoom: setZoom,
            toggleRecording: function toggleRecording(state, recordingSessionId) {
                return _toggleRecording(state, recordingSessionId);
            },
            toggleAutoplay: function toggleAutoplay(state) {
                return _toggleAutoplay(state);
            },
            toggleMoving: function toggleMoving(isMoving) {
                return _toggleMoving(isMoving);
            },
            next: function next() {
                return nextMove();
            },
            prev: function prev() {
                return prevMove();
            }
        };
    });



    let loadImageAfter=after(_count-5, () => {
        console.log("loaded");
        onLoadChange(true, 100);
        /*
        if (!viewerSize) {
            console.log("wadsfasdffdsa")
            let _viewerImageRef$curre, _viewerImageRef$curre2;
            setViewerSize({
                width: _viewerImageRef === null || _viewerImageRef === void 0 ? void 0 : (_viewerImageRef$curre = _viewerImageRef.current) === null || _viewerImageRef$curre === void 0 ? void 0 : _viewerImageRef$curre.clientWidth,
                height: _viewerImageRef === null || _viewerImageRef === void 0 ? void 0 : (_viewerImageRef$curre2 = _viewerImageRef.current) === null || _viewerImageRef$curre2 === void 0 ? void 0 : _viewerImageRef$curre2.clientHeight
            });
        }*/
    });

    let loadImage = function loadImage(index) {

        let aux= _count -1;
        if(index === aux){
            onLoadChange(true, 100);
        }

        if (!viewerSize) {
            let _viewerImageRef$curre, _viewerImageRef$curre2;
            setViewerSize({
                width: _viewerImageRef === null || _viewerImageRef === void 0 ? void 0 : (_viewerImageRef$curre = _viewerImageRef.current) === null || _viewerImageRef$curre === void 0 ? void 0 : _viewerImageRef$curre.clientWidth,
                height: _viewerImageRef === null || _viewerImageRef === void 0 ? void 0 : (_viewerImageRef$curre2 = _viewerImageRef.current) === null || _viewerImageRef$curre2 === void 0 ? void 0 : _viewerImageRef$curre2.clientHeight
            });
        }
    };

    var onImageLoaded = useCallback(function () {
        onLoadChange(loadedImagesCount + 1 === _count, Math.round((loadedImagesCount + 1) / _count * 100));
    }, [_count, loadedImagesCount, onLoadChange]);

    useTridiKeyPressHandler({
        nextMove: nextMove,
        prevMove: prevMove
    });

    var renderImages = function renderImages() {
        return _images.map(function (src, index) {

            return /*#__PURE__*/React.createElement("img", {
                key: index,
                src: src,
                onLoad:()=>loadImage(index),
                className: styles['tridi-viewer-image'] + " " + (currentImageIndex === index ? styles['tridi-viewer-image-shown'] : styles['tridi-viewer-image-hidden']),
                alt: ""
            });
        });
    };


    var renderHintOverlay = function renderHintOverlay() {
        return /*#__PURE__*/React.createElement("div", {
            className: "" + styles['tridi-hint-overlay'],
            onClick: hideHint,
            onTouchStart: hideHint
        }, !renderHint && /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(DragIcon, null), hintText && /*#__PURE__*/React.createElement("span", {
            className: "" + styles['tridi-hint-text']
        }, hintText)), renderHint && renderHint());
    };

    var generateViewerClassName = function generateViewerClassName() {
        var classNameStr = styles['tridi-viewer'];
        if (_draggable) classNameStr += ' ' + styles['tridi-draggable-true'];
        if (isRecording) classNameStr += ' ' + styles['tridi-recording-true'];
        if (touch) classNameStr += ' ' + styles['tridi-touch-true'];
        if (mousewheel) classNameStr += ' ' + styles['tridi-mousewheel-true'];
        if (hintOnStartup) classNameStr += ' ' + styles['tridi-hintOnStartup-true'];
        if (className) classNameStr += ' ' + className;
        return classNameStr;
    };

    var initHammer = useCallback(function () {
        var element = document.getElementById('viewerImage');
        var mc = new Hammer.Manager(element);
        var pinch = new Hammer.Pinch();
        mc.add([pinch]);
        mc.on('pinchstart', function (ev) {
            AnimatedValues.current.originOffset = {
                x: ev.center.x - AnimatedValues.current.x._value,
                y: ev.center.y - AnimatedValues.current.y._value
            };
            AnimatedValues.current.originZoom = AnimatedValues.current.zoom._value;
            AnimatedValues.current.isZooming = true;
        });
        mc.on('pinchend', function (ev) {
            AnimatedValues.current.isZooming = false;
            AnimatedValues.current.originOffset = null;
        });
        mc.on('pinchcancel', function (ev) {
            AnimatedValues.current.isZooming = false;
            AnimatedValues.current.originOffset = null;
        });
        mc.on('pinch', function (ev) {
            var scale = AnimatedValues.current.originZoom - 1 + ev.scale;
            scale = Math.max(minZoom, scale);
            scale = Math.min(maxZoom, scale);

            if (scale !== AnimatedValues.current.zoom._value) {
                AnimatedValues.current.zoom.setValue(scale);
                onZoom(scale);
            }
        });
    }, [minZoom, maxZoom]);
    useEffect(function () {
        initHammer();
    }, []);

    if (!TridiUtils.isValidProps({
        images: images,
        format: format,
        location: location
    })) {
        console.log('Invalid Settings');
        return null;
    }

    return /*#__PURE__*/React.createElement("div", {
        className: generateViewerClassName()
    }, hintVisible && renderHintOverlay(), /*#__PURE__*/React.createElement("div", {
        id: "viewerImage",
        ref: _viewerImageRef,
        onMouseDown: imageViewerMouseDownHandler,
        onMouseUp: imageViewerMouseUpHandler,
        onMouseMove: imageViewerMouseMoveHandler,
        onMouseLeave: imageViewerMouseLeaveHandler,
        onMouseEnter: imageViewerMouseEnterHandler,
        onClick: imageViewerClickHandler,
        style: {
            width: '100%'
        }
    }, /*#__PURE__*/React.createElement(AnimatedDiv, {
        ref: _viewerZoomRef,
        style: {
            width: '100%',
            transform: [{
                scale: AnimatedValues.current.zoom
            }, {
                translateY: AnimatedValues.current.y
            }, {
                translateX: AnimatedValues.current.x
            }]
        }
    }, (_images === null || _images === void 0 ? void 0 : _images.length) > 0 && renderImages(), viewerSize ? /*#__PURE__*/React.createElement(Pins, {
        pins: pins,
        viewerWidth: viewerSize.width,
        viewerHeight: viewerSize.height,
        currentFrameId: currentImageIndex,
        pinWidth: pinWidth,
        pinHeight: pinHeight,
        onPinDoubleClick: pinDoubleClickHandler,
        onPinClick: pinClickHandler,
        renderPin: renderPin
    }) : null)), showStatusBar && /*#__PURE__*/React.createElement(StatusBar, {
        isRecording: isRecording,
        currentImageIndex: currentImageIndex
    }), showControlBar && /*#__PURE__*/React.createElement(ControlBar, {
        hideRecord: hideRecord,
        isPlaying: isPlaying,
        isRecording: isRecording,
        isMoveing: isMoveing,
        setIsPlaying: setIsPlaying,
        setIsRecording: setIsRecording,
        setIsMoveing: setIsMoveing,
        onStartMoveing: function onStartMoveing() {
            return _toggleMoving(true);
        },
        onStopMoveing: function onStopMoveing() {
            return _toggleMoving(false);
        },
        onPlay: function onPlay() {
            return _toggleAutoplay(true);
        },
        onPause: function onPause() {
            return _toggleAutoplay(false);
        },
        onNext: function onNext() {
            return nextMove();
        },
        onPrev: function onPrev() {
            return prevMove();
        },
        onRecordStart: function onRecordStart() {
            _toggleRecording(true);

            setIsMoveing(false);
        },
        onRecordStop: function onRecordStop() {
            return _toggleRecording(false);
        },
        onZoomout: function onZoomout() {
            setZoom(AnimatedValues.current.zoom._value - 0.1);
        },
        onZoomin: function onZoomin() {
            setZoom(AnimatedValues.current.zoom._value + 0.1);
        }
    }));
});
Tridi.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    images: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    pins: PropTypes.array,
    pinWidth: PropTypes.number,
    pinHeight: PropTypes.number,
    format: PropTypes.string,
    location: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    draggable: PropTypes.bool,
    hintOnStartup: PropTypes.bool,
    hintText: PropTypes.string,
    autoplay: PropTypes.bool,
    autoplaySpeed: PropTypes.number,
    stopAutoplayOnClick: PropTypes.bool,
    stopAutoplayOnMouseEnter: PropTypes.bool,
    resumeAutoplayOnMouseLeave: PropTypes.bool,
    touch: PropTypes.bool,
    mousewheel: PropTypes.bool,
    inverse: PropTypes.bool,
    dragInterval: PropTypes.number,
    touchDragInterval: PropTypes.number,
    mouseleaveDetect: PropTypes.bool,
    showControlBar: PropTypes.bool,
    showStatusBar: PropTypes.bool,
    hideRecord: PropTypes.bool,
    renderPin: PropTypes.func,
    setPins: PropTypes.func,
    renderHint: PropTypes.func,
    zoom: PropTypes.number,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    onHintHide: PropTypes.func,
    onAutoplayStart: PropTypes.func,
    onAutoplayStop: PropTypes.func,
    onNextMove: PropTypes.func,
    onPrevMove: PropTypes.func,
    onNextFrame: PropTypes.func,
    onPrevFrame: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onFrameChange: PropTypes.func,
    onRecordStart: PropTypes.func,
    onRecordStop: PropTypes.func,
    onPinClick: PropTypes.func,
    onLoadChange: PropTypes.func
};
Tridi.defaultProps = {
    className: undefined,
    style: undefined,
    images: 'numbered',
    pin: undefined,
    pinWidth: 10,
    pinHeight: 10,
    format: undefined,
    location: './images',
    count: undefined,
    draggable: true,
    hintOnStartup: false,
    hintText: null,
    autoplay: false,
    autoplaySpeed: 50,
    stopAutoplayOnClick: false,
    stopAutoplayOnMouseEnter: false,
    resumeAutoplayOnMouseLeave: false,
    touch: true,
    mousewheel: false,
    inverse: false,
    dragInterval: 1,
    touchDragInterval: 2,
    mouseleaveDetect: false,
    showControlBar: false,
    showStatusBar: false,
    hideRecord: false,
    renderPin: undefined,
    setPins: function setPins() {},
    renderHint: undefined,
    zoom: 1,
    maxZoom: 3,
    minZoom: 1,
    onHintHide: function onHintHide() {},
    onAutoplayStart: function onAutoplayStart() {},
    onAutoplayStop: function onAutoplayStop() {},
    onNextMove: function onNextMove() {},
    onPrevMove: function onPrevMove() {},
    onNextFrame: function onNextFrame() {},
    onPrevFrame: function onPrevFrame() {},
    onDragStart: function onDragStart() {},
    onDragEnd: function onDragEnd() {},
    onFrameChange: function onFrameChange() {},
    onRecordStart: function onRecordStart() {},
    onRecordStop: function onRecordStop() {},
    onPinClick: function onPinClick() {},
    onZoom: function onZoom() {},
    onLoadChange: function onLoadChange() {}
};

export default Tridi;
//# sourceMappingURL=index.modern.js.map

var EventNameConfig = require('event-config').EventNameConfig

cc.Class({
    extends: cc.Component,

    properties: {
        lblTiming: cc.Label,
    },

    ctor: function () {
        var self = this;

        self.registerEvent();
        self.countDown = null;
    },

    registerEvent: function () {
        var self = this;

        window.addEventListener(EventNameConfig.SetTimingLevel, self.handleSetTimingLevel.bind(self), false);
        window.addEventListener(EventNameConfig.WonLevel, self.handleWonLevel.bind(self), false);
    },

    onDestroy: function () {
        var self = this;

        self.unregisterEvent();
    },

    unregisterEvent: function () {
        var self = this;

        window.removeEventListener(EventNameConfig.SetTimingLevel, self.handleSetTimingLevel.bind(self), false);
        window.removeEventListener(EventNameConfig.WonLevel, self.handleWonLevel.bind(self));
    },

    handleSetTimingLevel: function (data) {
        var self = this;

        self.startTimer(data.detail.time);
    },

    startTimer: function (duration) {
        var self = this;

        var timer = duration;
        self.countDown = setInterval(function () {
            timer--;
            self.lblTiming.string = "Time: " + timer;
            if (timer <= 0) {
                clearInterval(self.countDown);
                self.timeOut();
            }
        }, 1000);
    },

    handleWonLevel: function () {
        var self = this;

        clearInterval(self.countDown);
    },

    timeOut: function () {
        var self = this;

        self.settingEventTimeOut();
        window.dispatchEvent(self.TimeOut);
    },

    settingEventTimeOut: function () {
        var self = this;

        self.TimeOut = new CustomEvent(EventNameConfig.TimeOut, {});
    },
});

var EventNameConfig = require('event-config').EventNameConfig

cc.Class({
    extends: cc.Component,

    properties: {
        labelPoint: cc.Label,
        playerLifeUIController: require('player-life-ui-controller'),
        endLevelUIController: require('end-level-ui-controller'),
    },

    onLoad: function () {
        var self = this;

        self.unregisterEvent();
        self.registerEvent();
    },

    start: function () {
        var self = this;

    },

    registerEvent: function () {
        var self = this;

        window.addEventListener(EventNameConfig.UpdatePoint, self.handleUpdatePoint.bind(self), false);
        window.addEventListener(EventNameConfig.UpdatePlayerLife, self.handleUpdatePlayerLife.bind(self), false);
        window.addEventListener(EventNameConfig.LostLevel, self.handleLostLevel.bind(self), false);
        window.addEventListener(EventNameConfig.WonLevel, self.handleWonLevel.bind(self), false);
    },

    onDestroy: function () {
        var self = this;

        self.unregisterEvent();
    },

    unregisterEvent: function () {
        var self = this;

        window.removeEventListener(EventNameConfig.UpdatePoint, self.handleUpdatePoint.bind(self));
        window.removeEventListener(EventNameConfig.UpdatePlayerLife, self.handleUpdatePlayerLife.bind(self),);
        window.removeEventListener(EventNameConfig.LostLevel, self.handleLostLevel.bind(self));
        window.removeEventListener(EventNameConfig.WonLevel, self.handleWonLevel.bind(self));
    },

    handleUpdatePoint: function (data) {
        var self = this;

        self.labelPoint.string = "Score: " + data.detail.point;
    },

    handleUpdatePlayerLife: function (data) {
        var self = this;

        self.playerLifeUIController.SetLife(data.detail.life);
    },

    handleLostLevel: function (data) {
        var self = this;

        self.endLevelUIController.node.active = true;
        self.endLevelUIController.SetLosing(data.detail);
    },

    handleWonLevel: function (data) {
        var self = this;

        self.endLevelUIController.node.active = true;
        self.endLevelUIController.SetWinning(data.detail);
    }

});

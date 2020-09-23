var EventNameConfig = require('event-config').EventNameConfig

cc.Class({
    extends: cc.Component,

    properties: {
        lblLevel: cc.Label,
        lvlScore: cc.Label,
        lblTitle: cc.Label,
        btnNextLevel: cc.Button,
        btnRetryLevel: cc.Button,
    },

    SetLosing: function (data) {
        var self = this;

        self.lblTitle.string = "YOU'VE LOST";
        self.btnRetryLevel.node.active = false; // bug
        self.btnNextLevel.node.active = false;
        self.SetValue(data);
    },

    SetWinning: function (data) {
        var self = this;

        self.lblTitle.string = "YOU'VE WON";
        self.btnNextLevel.node.active = false; // bug
        self.btnRetryLevel.node.active = false;
        self.SetValue(data);
    },

    SetValue: function (data) {
        var self = this;

        self.lblLevel.string = "Level: " + data.level;
        self.lvlScore.string = "Score: " + data.point;
    },

    OnClickNextLevel: function () {
        var self = this;

        self.settingEventNextLevel();
        window.dispatchEvent(self.StartNextScene);
    },

    settingEventNextLevel: function () {
        var self = this;

        self.StartNextScene = new CustomEvent(EventNameConfig.StartNextScene, {});
    },

    OnClickRetryLvl: function () {
        var self = this;

        self.settingEventRetryLevel();
        window.dispatchEvent(self.RetryLevel);
    },

    settingEventRetryLevel: function () {
        var self = this;

        self.RetryLevel = new CustomEvent(EventNameConfig.RetryLevel, {});
    },

});

var PlayerActionConfig = require('player-action-config');
var MovementConfigInputDown = require('player-movement-config').MovementConfigInputDown;
var MovementConfigInputUp = require('player-movement-config').MovementConfigInputUp;
var EventNameConfig = require('event-config').EventNameConfig

cc.Class({
    extends: cc.Component,

    properties: {
        playerBullerContainController: require('player-bullet-contain-controller'),
        playerController: require('player-controller'),

        playerLife: 3,
        levelIndex: 1,
        timeLevel: 60,
        nextLevelSceneName: "",
        currentLevelSceneName: "",
    },

    //#region config

    ctor: function () {
        var self = this;

        self.registerKey();
        self.registerEvent();
        self.point = 0;
        cc.director.getCollisionManager().enabled = true;
    },

    start: function () {
        var self = this;

        self.startLevel();
    },

    registerKey: function () {
        var self = this;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, self.onKeyDown, self);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
    },

    unregisterKey: function () {
        var self = this;

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, self.onKeyDown, self);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
    },

    onKeyDown: function (event) {
        var self = this;

        MovementConfigInputDown.forEach(keyConfig => {
            if (event.keyCode == keyConfig.inputValue) {
                self.playerController[keyConfig.trueValue] = true;
                self.playerController[keyConfig.falseValue] = false;
            }
        });

        PlayerActionConfig.PlayerActionInputDown.forEach(keyConfig => {
            if (event.keyCode == keyConfig.inputValue) {
                var func = self[keyConfig.functionnName];
                if (typeof func == "function") {
                    func.bind(self)();
                }
            }
        });
    },

    onKeyUp: function (event) {
        var self = this;

        MovementConfigInputUp.forEach(keyConfig => {
            if (event.keyCode == keyConfig.inputValue) {
                self.playerController[keyConfig.falseValue] = false;
            }
        });
    },

    registerEvent: function () {
        var self = this;

        window.addEventListener(EventNameConfig.EnemyGotShotDown, self.handleEnemyGotShotDown.bind(self), false);
        window.addEventListener(EventNameConfig.PlayerGotShot, self.handlePlayerGotShot.bind(self), false);
        window.addEventListener(EventNameConfig.AllEnemyDead, self.handleAllEnemyDead.bind(self), false);
        window.addEventListener(EventNameConfig.TimeOut, self.handleTimeOut.bind(self), false);
        window.addEventListener(EventNameConfig.StartNextScene, self.handleStartNextScene.bind(self), false);
        window.addEventListener(EventNameConfig.RetryLevel, self.handleRetryLevel.bind(self), false);
    },

    onDestroy: function () {
        var self = this;

        self.unregisterEvent();
        self.unregisterKey();
    },

    unregisterEvent: function () {
        var self = this;

        window.removeEventListener(EventNameConfig.EnemyGotShotDown, self.handleEnemyGotShotDown.bind(self), false);
        window.removeEventListener(EventNameConfig.PlayerGotShot, self.handlePlayerGotShot.bind(self), false);
        window.removeEventListener(EventNameConfig.AllEnemyDead, self.handleAllEnemyDead.bind(self), false);
        window.removeEventListener(EventNameConfig.TimeOut, self.handleTimeOut.bind(self), false);
        window.removeEventListener(EventNameConfig.StartNextScene, self.handleStartNextScene.bind(self), false);
        window.removeEventListener(EventNameConfig.RetryLevel, self.handleRetryLevel.bind(self), false);
    },
    //#endregion

    settingEventUpdatePoint: function () {
        var self = this;

        self.UpdatePoint = new CustomEvent(EventNameConfig.UpdatePoint, {
            detail: {
                point: self.point
            }
        });
    },

    settingEventUpdatePlayerLife: function () {
        var self = this;

        self.UpdatePlayerLife = new CustomEvent(EventNameConfig.UpdatePlayerLife, {
            detail: {
                life: self.playerLife,
            }
        });
    },

    handleEnemyGotShotDown: function (data) {
        var self = this;

        self.point += data.detail.point;
        self.settingEventUpdatePoint();
        window.dispatchEvent(self.UpdatePoint);
    },

    handlePlayerGotShot: function (data) {
        var self = this;

        self.playerLife--;
        self.settingEventUpdatePlayerLife();
        window.dispatchEvent(self.UpdatePlayerLife);

        if (self.playerLife <= 0) {
            self.endLosingLevel();
        }
    },

    startLevel: function () {
        var self = this;

        self.settingEventUpdatePlayerLife();
        window.dispatchEvent(self.UpdatePlayerLife);

        self.settingEventSetTime();
        window.dispatchEvent(self.SetTimingLevel);
    },

    settingEventSetTime: function () {
        var self = this;

        self.SetTimingLevel = new CustomEvent(EventNameConfig.SetTimingLevel, {
            detail: {
                time: self.timeLevel,
            }
        });
    },

    //#region lost-level

    handleTimeOut: function (data) {
        var self = this;

        self.endLosingLevel();
    },

    endLosingLevel: function () {
        var self = this;

        self.unregisterKey();
        self.settingEventLoseLevel();
        window.dispatchEvent(self.LostLevel);
    },

    settingEventLoseLevel: function () {
        var self = this;

        self.LostLevel = new CustomEvent(EventNameConfig.LostLevel, {
            detail: {
                level: self.levelIndex,
                point: self.point
            }
        });
    },

    //#endregion

    //#region won-level

    handleAllEnemyDead: function () {
        var self = this;

        self.unregisterKey();
        self.settingEventWonLevel();
        window.dispatchEvent(self.WonLevel);
    },

    settingEventWonLevel: function () {
        var self = this;

        self.WonLevel = new CustomEvent(EventNameConfig.WonLevel, {
            detail: {
                level: self.levelIndex,
                point: self.point
            }
        });
    },

    //#endregion

    shootBullet: function () {
        var self = this;

        var position = self.node.parent.convertToWorldSpaceAR(self.playerController.node.position);
        self.playerBullerContainController.Shot(position);
    },

    handleStartNextScene: function (data) {
        var self = this;

        cc.director.preloadScene(self.nextLevelSceneName, function () {
            cc.director.loadScene(self.nextLevelSceneName);
        });

    },

    handleRetryLevel: function (data) {
        var self = this;

        cc.director.preloadScene(self.currentLevelSceneName, function () {
            cc.director.loadScene(self.currentLevelSceneName);
        });
    },

});

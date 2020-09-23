var MovementConfigInputDown = require('player-movement-config').MovementConfigInputDown;
var MovementConfigInputUp = require('player-movement-config').MovementConfigInputUp;
var EventNameConfig = require('event-config').EventNameConfig

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 500,
        revivedAnimation: cc.AnimationClip,
    },

    ctor: function () {
        var self = this;

        self.isMovingLeft = false;
        self.isMovingRight = false;
        self.isMovingUp = false;
        self.isMovingDown = false;
        self.GotShot = null;
        self.registerEvent();
    },

    start: function () {
        var self = this;

        self.animator = self.node.getComponent(cc.Animation);
        self.collider = self.node.getComponent(cc.BoxCollider);
    },

    registerEvent: function () {
        var self = this;

        window.addEventListener(EventNameConfig.LostLevel, self.handleLostLevel.bind(self), false);
        window.addEventListener(EventNameConfig.WonLevel, self.handleWonLevel.bind(self), false);
    },

    onDestroy: function () {
        var self = this;

        self.unregisterEvent();
    },

    unregisterEvent: function () {
        var self = this;

        window.removeEventListener(EventNameConfig.LostLevel, self.handleLostLevel.bind(self), false);
        window.removeEventListener(EventNameConfig.WonLevel, self.handleWonLevel.bind(self));
    },

    settingEventGotShot: function () {
        var self = this;

        var positionWorldSpace = self.node.parent.convertToWorldSpaceAR(self.node.position);
        self.GotShot = new CustomEvent(EventNameConfig.PlayerGotShot, {
            detail: {
                position: positionWorldSpace,
            }
        });
    },

    onCollisionEnter: function (other, self) {
        var self = this;

        if (other.name.includes("enemy-neutron")) {
            self.gotShot();
        }
    },

    gotShot: function () {
        var self = this;

        self.settingEventGotShot();
        window.dispatchEvent(self.GotShot);
        self.setInvinsible();
    },

    handleLostLevel: function () {
        var self = this;

        self.node.active = false;
    },

    handleWonLevel: function () {
        var self = this;

        self.collider.enabled = false;
    },

    setInvinsible: function () {
        var self = this;

        self.collider.enabled = false;
        self.animator.play(self.revivedAnimation.name);
    },

    setNormal: function () {
        var self = this;

        self.collider.enabled = true;
    },

    update: function (deltaTime) {
        var self = this;

        if (self.isMovingRight) {
            self.node.x += self.speed * deltaTime;
        }
        if (self.isMovingLeft) {
            self.node.x -= self.speed * deltaTime;
        }
    },


});

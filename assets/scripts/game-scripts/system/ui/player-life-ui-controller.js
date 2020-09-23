cc.Class({
    extends: cc.Component,

    properties: {
        arrPlayerLifeIcon: {
            type: cc.Node,
            default: []
        },
        labelLife: cc.Label,
    },

    SetLife: function (life) {
        var self = this;

        self.arrPlayerLifeIcon.forEach(playerLifeIcon => {
            playerLifeIcon.active = false;
        });

        if (life > 0 && life < self.arrPlayerLifeIcon.length) {
            for (var indexLifeIcon = 0; indexLifeIcon < life; indexLifeIcon++) {
                self.arrPlayerLifeIcon[indexLifeIcon].active = true;
            }
        }
        self.labelLife.string = "Life: " + life;
    },

});

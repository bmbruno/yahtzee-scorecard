class Scorecard {

    constructor () {

        this.score = {

            upper: {
                ones: -1,
                twos: -1,
                threes: -1,
                fours: -1,
                fives: -1,
                sixes: -1
            },

            lower: {
                threeOfKind: -1,
                fourOfKind: -1,
                fullHouse: -1,
                smallStraight: -1,
                largeStraight: -1,
                yahtzee: -1,
                chance: -1
            },

            bonus: 0,

            totalUpper: -1,
            totalLower: -1,
            totalScore: -1
        }
    }

    updateScore(section, line, points) {
        this.score[section][line] = points;
        this.updateTotals();
    }

    addYahtzeeScore(points) {
        if (this.score.lower.yahtzee < 0)
            this.score.lower.yahtzee = 0;

        this.score.lower.yahtzee += points;
        this.updateTotals();
    }

    updateTotals() {
        this.score.totalUpper = this.getSectionScore(this.score.upper);
        this.score.totalLower = this.getSectionScore(this.score.lower);
        this.score.bonus = (this.score.totalUpper >= 63) ? 35 : 0;

        this.score.totalScore = this.score.totalUpper + this.score.bonus + this.score.totalLower;
    }

    getSectionScore(lines) {
        let total = 0;

        for (let key of Object.keys(lines))
        {
            if (lines[key] > 0)
                total += lines[key];
        }

        return total;
    }

    resetScore() {

        this.score.upper.ones = -1;
        this.score.upper.twos = -1;
        this.score.upper.threes = -1;
        this.score.upper.fours = -1;
        this.score.upper.fives = -1;
        this.score.upper.sixes = -1;

        this.score.lower.threeOfKind = -1;
        this.score.lower.fourOfKind = -1;
        this.score.lower.fullHouse = -1;
        this.score.lower.smallStraight = -1;
        this.score.lower.largeStraight = -1;
        this.score.lower.yahtzee = -1;
        this.score.lower.chance = -1;

        this.score.bonus = 0;
        this.score.totalUpper = 0;
        this.score.totalLower = 0;
        this.score.totalScore = 0;
    }
}

(function (window, document) {

    window.YS = {

        scorecard: new Scorecard(),

        allButtonSections: ["ButtonsOnes", "ButtonsTwos", "ButtonsThrees", "ButtonsFours", "ButtonsFives", "ButtonsSixes", 
                            "ButtonsThreeOfKind", "ButtonsFourOfKind", "ButtonsFullHouse", "ButtonsSmallStraight", "ButtonsLargeStraight", "ButtonsYahtzee", "ButtonsChance"],

        allLabelSections: ["LabelOnes", "LabelTwos", "LabelThrees", "LabelFours", "LabelFives", "LabelSixes", 
                           "LabelThreeOfKind", "LabelFourOfKind", "LabelFullHouse", "LabelSmallStraight", "LabelLargeStraight", "LabelYahtzee", "LabelChance"],

        updateScore: function(section, line, points) {

            YS.scorecard.updateScore(section, line, points);
            YS.renderScorecard();
            YS.saveScorecard();
        },

        enterScore: function(section, line, inputID, maxValue) {
            
            let scoreInput = document.getElementById(inputID);

            if (scoreInput.value === null)
                return;
 
            if (isNaN(scoreInput.value) || scoreInput.value === "")
                return;

            if (scoreInput.value > maxValue || scoreInput.value < 0) {
                alert(`Score must be between 0 and ${maxValue}.`);
                scoreInput.value = "";
                return;
            }

            YS.scorecard.updateScore(section, line, parseInt(scoreInput.value, 10));
            YS.renderScorecard();
            scoreInput.value = "";
            YS.saveScorecard();
        },

        promptForScore: function (section, line, label) {

            let scoreInput = window.prompt(`Enter points for ${label}`);

            if (scoreInput === null)
                return;

            if (isNaN(scoreInput))
                return;

            YS.scorecard.updateScore(section, line, parseInt(scoreInput, 10));
            YS.renderScorecard();
        },

        promptClearScore: function (section, line, label) {

            if (confirm(`Clear score for ${label}?`)) {

                if (line === "yahtzee") {
                    YS.resetYahtzee();
                } else {
                    YS.updateScore(section, line, -1);
                }
            }

        },

        renderScorecard: function () {
            
            // Score field values

            document.getElementById("ScoreOnes").innerHTML = YS.formatScore(YS.scorecard.score.upper.ones);
            document.getElementById("ScoreTwos").innerHTML = YS.formatScore(YS.scorecard.score.upper.twos);
            document.getElementById("ScoreThrees").innerHTML = YS.formatScore(YS.scorecard.score.upper.threes);
            document.getElementById("ScoreFours").innerHTML = YS.formatScore(YS.scorecard.score.upper.fours);
            document.getElementById("ScoreFives").innerHTML = YS.formatScore(YS.scorecard.score.upper.fives);
            document.getElementById("ScoreSixes").innerHTML = YS.formatScore(YS.scorecard.score.upper.sixes);

            document.getElementById("ScoreThreeOfKind").innerHTML = YS.formatScore(YS.scorecard.score.lower.threeOfKind);
            document.getElementById("ScoreFourOfKind").innerHTML = YS.formatScore(YS.scorecard.score.lower.fourOfKind);
            document.getElementById("ScoreFullHouse").innerHTML = YS.formatScore(YS.scorecard.score.lower.fullHouse);
            document.getElementById("ScoreSmallStraight").innerHTML = YS.formatScore(YS.scorecard.score.lower.smallStraight);
            document.getElementById("ScoreLargeStraight").innerHTML = YS.formatScore(YS.scorecard.score.lower.largeStraight);
            document.getElementById("ScoreYahtzee").innerHTML = YS.formatScore(YS.scorecard.score.lower.yahtzee);
            document.getElementById("ScoreChance").innerHTML = YS.formatScore(YS.scorecard.score.lower.chance);

            document.getElementById("ScoreUpperTotal").innerHTML = YS.formatScore(YS.scorecard.score.totalUpper);
            document.getElementById("ScoreLowerTotal").innerHTML = YS.formatScore(YS.scorecard.score.totalLower);
            document.getElementById("ScoreTotal").innerHTML = YS.formatScore(YS.scorecard.score.totalScore);

            // Clear button display

            document.getElementById("ClearOnes").style.display = (YS.scorecard.score.upper.ones >= 0) ? "inline" : "none";
            document.getElementById("ClearTwos").style.display = (YS.scorecard.score.upper.twos >= 0) ? "inline" : "none";
            document.getElementById("ClearThrees").style.display = (YS.scorecard.score.upper.threes >= 0) ? "inline" : "none";
            document.getElementById("ClearFours").style.display = (YS.scorecard.score.upper.fours >= 0) ? "inline" : "none";
            document.getElementById("ClearFives").style.display = (YS.scorecard.score.upper.fives >= 0) ? "inline" : "none";
            document.getElementById("ClearSixes").style.display = (YS.scorecard.score.upper.sixes >= 0) ? "inline" : "none";

            document.getElementById("ClearThreeOfKind").style.display = (YS.scorecard.score.lower.threeOfKind >= 0) ? "inline" : "none";
            document.getElementById("ClearFourOfKind").style.display = (YS.scorecard.score.lower.fourOfKind >= 0) ? "inline" : "none";
            document.getElementById("ClearFullHouse").style.display = (YS.scorecard.score.lower.fullHouse >= 0) ? "inline" : "none";
            document.getElementById("ClearSmallStraight").style.display = (YS.scorecard.score.lower.smallStraight >= 0) ? "inline" : "none";
            document.getElementById("ClearLargeStraight").style.display = (YS.scorecard.score.lower.largeStraight >= 0) ? "inline" : "none";
            document.getElementById("ClearYahtzee").style.display = (YS.scorecard.score.lower.yahtzee >= 0) ? "inline" : "none";
            document.getElementById("ClearChance").style.display = (YS.scorecard.score.lower.chance >= 0) ? "inline" : "none";

            YS.updateYahtzeeScoreButtonStatus();

            let bonusMessage = document.getElementById("BonusMessage");
            let bonusRemaining = document.getElementById("BonusRemaining");
            let bonusTotal = document.getElementById("BonusTotal");

            if (YS.scorecard.score.bonus === 35) {
                bonusMessage.style.display = "inline";
                bonusRemaining.style.display = "none";
                bonusTotal.innerHTML = YS.scorecard.score.totalUpper + YS.scorecard.score.bonus;
            } else {
                bonusMessage.style.display = "none";
                bonusRemaining.style.display = "inline";
                bonusRemaining.innerHTML = `${YS.getBonusRemaining()} remaining`;
            }

        },

        formatScore: function (scoreValue) {
            
            if (scoreValue < 0)
                return "";

            return scoreValue;
        },

        getBonusRemaining: function () {

            let remaining = 63 - YS.scorecard.score.totalUpper;

            if (remaining < 0) {
                return 0;
            }
            
            return remaining;
        },

        zeroYahtzee: function () {
            YS.updateScore("lower", "yahtzee", 0);
            YS.renderScorecard();
        },

        resetYahtzee: function () {
            YS.updateScore("lower", "yahtzee", -1);
            YS.renderScorecard();
        },

        updateYahtzeeScore: function (points) {
            YS.scorecard.addYahtzeeScore(points);
            YS.renderScorecard();
            YS.saveScorecard();
        },

        updateYahtzeeScoreButtonStatus: function () {

            if (YS.scorecard.score.lower.yahtzee >= 50) {
                document.getElementById("AdditionalYahtzeeButton").style.display = "inline";
                document.getElementById("FirstYahtzeeButton").style.display = "none";
            } else {
                document.getElementById("AdditionalYahtzeeButton").style.display = "none";
                document.getElementById("FirstYahtzeeButton").style.display = "inline";
            }

        },

        showButtons: function (buttonsID, labelID) {
            document.getElementById(buttonsID).style.display = "table-cell";
            document.getElementById(labelID).style.display = "none";
        },

        hideButtons: function (buttonsID, labelID) {
            document.getElementById(buttonsID).style.display = "none";
            document.getElementById(labelID).style.display = "table-cell";
        },

        hideAllButtons: function () {
            for (index in YS.allButtonSections) {
                YS.hideButtons(YS.allButtonSections[index], YS.allLabelSections[index]);
            }
        },

        showClear: function (buttonID) {
            document.getElementById(buttonID).style.display = "inline";
        },

        hideClear: function (buttonID) {
            document.getElementById(buttonID).style.display = "none";
        },

        setFocus: function (inputID) {
            document.getElementById(inputID).focus();
        },

        resetScorecard: function() {
            if (confirm("Are you sure you want to reset the scorecard?")) {

                YS.hideAllButtons();

                YS.zeroYahtzee();
                YS.scorecard.resetScore();
                YS.renderScorecard();
                YS.clearStorage();
            }
        },

        saveScorecard: function () {
            window.localStorage.setItem("yahtzee-scorecard", JSON.stringify(YS.scorecard.score));
        },

        loadScorecard: function() {
            var rawData = window.localStorage.getItem("yahtzee-scorecard");

            if (rawData == null || rawData == "")
                return;

            YS.scorecard.score = JSON.parse(rawData);
        },
        
        clearStorage: function () {
            window.localStorage.removeItem("yahtzee-scorecard");
        },

        setTheme: function () {
            var themePicker = document.getElementById("ThemePicker");

            document.body.classList = [];
            document.body.classList.add("theme");
            document.body.classList.add(themePicker.value);

            YS.saveTheme(themePicker.value);
        },

        saveTheme: function (theme) {
            window.localStorage.setItem("yahtzee-theme", theme);
        },

        loadTheme: function () {
            return window.localStorage.getItem("yahtzee-theme");
        },

        initTheme: function () {
            var theme = YS.loadTheme();

            if (theme && theme != "") {
                var themePicker = document.getElementById("ThemePicker");
                themePicker.value = theme;
                YS.setTheme();
            }
        }
    };

    YS.loadScorecard();
    YS.scorecard.updateTotals();
    YS.renderScorecard();
    YS.initTheme();

})(window, document);

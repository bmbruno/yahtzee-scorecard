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

            let bonusMessage = document.getElementById("BonusMessage");
            let bonusRemaining = document.getElementById("BonusRemaining");
            if (YS.scorecard.score.bonus === 35) {
                bonusMessage.style.display = "inline";
                bonusRemaining.style.display = "none";
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
            document.getElementById("AdditionalYahtzeeButton").style.display = "none";
            document.getElementById("FirstYahtzeeButton").style.display = "inline";
            YS.renderScorecard();
        },

        resetYahtzee: function () {
            YS.updateScore("lower", "yahtzee", -1);
            document.getElementById("AdditionalYahtzeeButton").style.display = "none";
            document.getElementById("FirstYahtzeeButton").style.display = "inline";
            YS.renderScorecard();
        },

        updateYahtzeeScore: function (points) {
            YS.scorecard.addYahtzeeScore(points);
            document.getElementById("AdditionalYahtzeeButton").style.display = "inline";
            document.getElementById("FirstYahtzeeButton").style.display = "none";
            YS.renderScorecard();
            YS.saveScorecard();
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

        setFocus: function (inputID) {
            document.getElementById(inputID).focus();
        },

        resetScorecard: function() {
            if (confirm("Are you sure you want to reset the scorecard?")) {
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
            window.localStorage.clear();
        }
    };

    YS.loadScorecard();
    YS.scorecard.updateTotals();
    YS.renderScorecard();

})(window, document);

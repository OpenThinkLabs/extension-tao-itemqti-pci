define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Answer',
    'taoQtiItem/qtiCreator/widgets/interactions/helpers/answerState'
], function(stateFactory, Answer, answerStateHelper){

    var LiquidsInteractionStateAnswer = stateFactory.extend(Answer, function(){

        //forward to one of the available sub state, according to the response processing template
        answerStateHelper.forward(this.widget);

    }, function(){

    });

    LiquidsInteractionStateAnswer.prototype.initResponseForm = function initResponseForm() {
        answerStateHelper.initResponseForm(
            this.widget,
            {
                rpTemplates: ['CUSTOM', 'MATCH_CORRECT', 'NONE'],
            }
        );
    };

    return  LiquidsInteractionStateAnswer;
});

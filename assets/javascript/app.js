$(document).ready(function(){

    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);

})

var trivia = {
// trivia properties
correct: 0,
incorrect: 0,
unanswered: 0,
currentSet: 0,
timer: 20,
timerOn: false,
timerId : '',
// questions options and answers data
questions: {
    q1: 'Which bloodline wields the Garo armor for three generations?',
    q2: 'What form of combat does the golden Makai Armor specializes in?',
    q3: 'Who portrays Rei Suzumura in the GARO series?',
    q4: 'Who is the current wielder of the Garo the Golden Knight armor in the Ryuga-verse?',
    q5: "Who is the current wielder of the Dan the Midnight Sun Knight armor?",
    q6: 'Who is the Messiah?',
    q7: "How many forms does Legules the lengendary ancient Horror, take?",
    q8: "What are the Karakuri in the world of Horror?",
    q9: "What time period is the GARO: The Carved Seal of Flames animation set in?",
    q10: "What is Amon's favorite game?"
},
options: {
    q1: ['Luis bloodline', 'Saejima bloodline', 'Dougai bloodline', 'Suzumura bloodline'],
    q2: ['longsword combat', 'spear combat', 'scimitar combat', 'dual saber combat'],
    q3: ['Toru Shinagawa', 'Junya Ikeda', 'Wataru Kuriyama', 'Ray Fujita'],
    q4: ['Ryuga Dogai', 'Tosei Kaneshiro', 'Aguri Kusugami', 'Takeru Jakuzure'],
    q5: ['Akatsuki', 'Hyuga', 'Tsubasa', 'Noboru'],
    q6: ['Progenitor of all Horrors in both the Original Series and Ryuga-verse.', 'A Makai priestess and serve as an assistant for the Makai knights.', 'A Makai priestess trainee and serve as an assistant for the Makai knights.', 'One of the strongest Horrors in existence lableled as the Ancient Red Demon.'],
    q7: ['1', '2', '3', '4'],
    q8: ['They are regular Horrors that are able to possess humans and take control of them.', 'They are personal foot solders and "family" of the legendary Horror Legules.', 'They are armored stallions that assist the Makai knights in combat.', 'They are guardian spirits to the Spirit Beast featured in the second season, Flash Knight.'],
    q9: ['the Medevial age', 'the Renaissance', 'the Roman Empire', 'the Reformation'],
    q10: ['Gomoku', 'Checker', 'Igo', 'Bar Chess']
},
answers: {
    q1: 'Saejima bloodline',
    q2: 'longsword combat',
    q3: 'Ray Fujita',
    q4: 'Ryuga Dogai',
    q5: 'Tsubasa',
    q6: 'She is the progenitor of all Horrors in both the Original Series and Ryuga-verse.',
    q7: '3',
    q8: 'They are regular Horrors that are able to possess humans and take control of them.',
    q9: 'the Medevial age',
    q10: 'Bar Chess'
},
// trivia methods
// method to initialize game
startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
},
// method to loop through and display questions and options 
nextQuestion : function(){
    
    // set timer to 10 seconds each question
    trivia.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
    trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
    $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
},
// method to decrement counter and count unanswered if timer runs out
timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
    $('#timer').text(trivia.timer);
    trivia.timer--;
        if(trivia.timer === 4){
        $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
    trivia.unanswered++;
    trivia.result = false;
    clearInterval(trivia.timerId);
    resultId = setTimeout(trivia.guessResult, 1000);
    $('#results').html('<h3>TIME IS UP! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
    
    // adds results of game (correct, incorrect, unanswered) to the page
    $('#results')
        .html('<h3>THANK YOU FOR PLAYING!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>TRY AGAIN?</p>');
    
    // hide game sction
    $('#game').hide();
    
    // show start button to begin a new game
    $('#start').show();
    }
    
},
// method to evaluate the option clicked
guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
    // turn button green for correct
    $(this).addClass('btn-success').removeClass('btn-info');
    
    trivia.correct++;
    clearInterval(trivia.timerId);
    resultId = setTimeout(trivia.guessResult, 1000);
    $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
    // turn button clicked red for incorrect
    $(this).addClass('btn-danger').removeClass('btn-info');
    
    trivia.incorrect++;
    clearInterval(trivia.timerId);
    resultId = setTimeout(trivia.guessResult, 1000);
    $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
    }
    
},
// method to remove previous question results and options
guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
    
}

}
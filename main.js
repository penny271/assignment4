'use strict';

const loading = document.getElementById(`loading`); //ロード中の文言
const container = document.getElementById(`container`); //大問、ジャンル、難易度を含む範囲
const title = document.getElementById(`title`); //大問全体
const titleNum = document.getElementById(`title__num`); //大問の数字部分
const genreDetail = document.getElementById(`genre__detail`); //ジャンル詳細
const difficultyDetail = document.getElementById(`difficulty__detail`); //難易度詳細
const quizContent = document.getElementById(`quiz__content`);
const choices = Array.from(document.getElementsByClassName('choice')); //複数の問題文
const answers = document.getElementById(`answers`); //ul要素
const homeBtn = document.getElementById(`homeBtn`);
const startBtn = document.getElementById(`startBtn`);

let quizContents = []; //!APIの内容を模範解答のような形式に変更したものを収納
let currentQuestion; //!現在解いている問題を表示
let questionIndex = 0; //!何番目の問題かを管理
let duplicatedQuestions = [];
let score = 0;

fetch('https://opentdb.com/api.php?amount=10&type=multiple')
   .then((res) => {
      return res.json();
   })
   .then((loadedQuestions) => {
      //APIの情報を加工しやすくするためformattedQuestionに
      //新しくオブジェクトと値を入力して保存
      quizContents = loadedQuestions.results.map((loadedQuestion) => {
         const formattedQuestion = {
            question: loadedQuestion.question,
            category: loadedQuestion.category,
            difficulty: loadedQuestion.difficulty,
         };

         const multipleChoices = [...loadedQuestion.incorrect_answers];
         //正解の解答を配列に入れ、splice()で挿入したランダムな番号を正解とする
         formattedQuestion.answer = Math.floor(Math.random() * 4);
         multipleChoices.splice(
            formattedQuestion.answer,
            0,
            loadedQuestion.correct_answer
         );

         //プロパティと値を設定して各問題にアクセスできるようにする
         multipleChoices.forEach((choice, index) => {
            formattedQuestion['choice' + index] = choice;
         });
         return formattedQuestion;
      }); //-map終わり
      loading.classList.add('hidden');
      container.classList.remove('hidden');
      answers.classList.remove('hidden');
      startGame();
   })
   .catch((err) => {
      console.error('Failed to load API');
   });

//10問解き終わったあとに不要な要素を隠す
const hideElements = () => {
   const genre = document.getElementById(`genre`);
   const difficulty = document.getElementById(`difficulty`);
   genre.classList.add('hidden');
   difficulty.classList.add('hidden');

   title.textContent = `あなたの正答数は${score}です！！`;
   quizContent.textContent = '再度チャレンジしたい場合は以下をクリック!!';
   choices.forEach((choice) => {
      choice.classList.add('hidden');
   });
   homeBtn.classList.remove('hidden');
};

//ブラウザに問題文やジャンル、難易度を表示する
const showContent = () => {
   currentQuestion = duplicatedQuestions[questionIndex];

   titleNum.textContent = `${questionIndex + 1}`;
   genreDetail.textContent = ` ${currentQuestion.category}`;
   difficultyDetail.textContent = ` ${currentQuestion.difficulty}`;
   quizContent.innerHTML = ` ${currentQuestion.question}`;
   // genreDetail.textContent = 'currentQuestion.category';

   choices.forEach((choice, index) => {
      choices[index].textContent = currentQuestion['choice' + index]; //4択問題の内容
      // choices[index].textContent = 'AAAAAAAAAAAAAA';
   });
};

//ゲームを開始する
const startGame = () => {
   duplicatedQuestions = [...quizContents];
   // if (questionIndex == duplicatedQuestions.length) {
   if (questionIndex == 2) {
      //------------後で直す!!!!
      // if (questionIndex == duplicatedQuestions.length) {
      hideElements();
      return;
   }

   showContent();
};

//選択肢をクリックした際の正誤判定を行う
//正解なら青、不正解なら赤色を付ける
choices.forEach((choice) => {
   choice.addEventListener('click', (e) => {
      const selectedChoice = e.target;
      let classToApply = 'incorrect';
      classToApply =
         currentQuestion.answer == selectedChoice.dataset['number']
            ? 'correct'
            : 'incorrect';
      if (classToApply === 'correct') {
         selectedChoice.classList.add(classToApply);
         score++;
      } else {
         selectedChoice.classList.add(classToApply);
      }
      //正解、不正解の色付けがされ、次の問題に移る時間を調整
      setTimeout(() => {
         selectedChoice.classList.remove(classToApply);
         questionIndex++;
         startGame();
      }, 300);
   });
   // choices.forEach((choice) => {});
});

const changePage = Array.from(document.getElementsByClassName('changePage'));

// ホームボタン、開始ボタンを押したときの挙動
changePage.forEach((changePg) => {
   changePg.addEventListener('click', (e) => {
      const selectedChoice = e.target;

      if (selectedChoice === homeBtn.firstChild) {
         quizContent.textContent = '以下のボタンをクリック';
         homeBtn.classList.add('hidden');
         startBtn.classList.remove('hidden');
         title.textContent = 'ようこそ';
         return;
      }

      if (selectedChoice === startBtn.firstChild) {
         window.location.reload();
      }
   });
});

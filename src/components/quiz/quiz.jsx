import React, { useRef, useState, useEffect } from 'react';
import './quiz.css'
import {data} from '../../assets/data'

const App = () => {

    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const incorrectAnswersRef = useRef([]);

    const [timeLeft, setTimeLeft] = useState(3600);
    const [timeTaken, setTimeTaken] = useState(null);
    const startTimeRef = useRef(Date.now());

    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    let [lock, setlock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);

    useEffect(() => {
        const timerId = setInterval(() => {
          setTimeLeft(prevTime => {
            if (prevTime === 0) {
              clearInterval(timerId);
              setResult(true); // Auto-submit when time runs out
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
    
        // Cleanup function: clear interval on unmount or when quiz ends
        return () => clearInterval(timerId);
      }, [result]); // Dependency: result (to stop timer when quiz ends)

      useEffect(() => {
        if (result) {
          const endTime = Date.now();
          setTimeTaken((endTime - startTimeRef.current) / 1000); // Calculate time taken in seconds
        }
      }, [result]);
    
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      };
    

    useEffect(() => {
        if (result) {
          setIncorrectAnswers(incorrectAnswersRef.current);
        }
      }, [result]);

    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_array = [Option1, Option2, Option3, Option4];

    const checkAns = (e, ans) => {
        if(lock === false){
            if(question.ans === ans){
                e.target.classList.add("correct");
                setlock(true);
                setScore(prev => prev + 1);
            }else{
                e.target.classList.add("wrong");
                setlock(true);
                incorrectAnswersRef.current.push(index + 1);
                option_array[question.ans - 1].current.classList.add("correct");
            }
        }
    }

    const next = () => {
        if(lock === true){
            if(index === data.length - 1){
                setResult(true);
                return 0;
            }
            setIndex(++index);
            setQuestion(data[index]);
            setlock(false);
            option_array.map((option) => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
                return null;
            })
        }
    }

    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setlock(false);
        setResult(false);
    }

  return <div className='container'>
    <h1>Sathvik Math Quiz</h1>
    <hr/>
    {result?
    <><h2>You scored <b>{score}</b> out of <b>{data.length}</b></h2>
    <h2><b>Questions to which you submitted incorrect answers: </b>{incorrectAnswers.join(', ')}</h2>
    <h2><b>Time taken:</b> {formatTime(timeTaken)}</h2></>:
    <>
    <div className="timer"><b>Time Remaining:</b> {formatTime(timeLeft)}</div>
    <div class="parent-element">
        <h2>{index + 1}</h2>
        <img src={question.image} alt="Question Illustration"/>
    </div>
    <ul>
        <li ref = {Option1} onClick={(e) => {checkAns(e, 1)}}>{question.option1}</li>
        <li ref = {Option2} onClick={(e) => {checkAns(e, 2)}}>{question.option2}</li>
        <li ref = {Option3} onClick={(e) => {checkAns(e, 3)}}>{question.option3}</li>
        <li ref = {Option4} onClick={(e) => {checkAns(e, 4)}}>{question.option4}</li>
    </ul>
    <button onClick={next}>Next</button>
    <div className='index'>{index + 1} of {data.length} questions</div>
    </>}
  </div>
}

export default App;
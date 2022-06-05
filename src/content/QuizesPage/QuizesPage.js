import React, { useEffect, useState, useRef } from 'react';
import QuizesPanel from './QuizesPanel';
import { TextInput, Button } from 'carbon-components-react';
import {
  Add24,
  CircleFilled20,
  Notification20,
  UserAvatar20,
} from '@carbon/icons-react';
import { SkeletonText } from 'carbon-components-react';

const QuizesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [polledData, setPolledData] = useState(true);
  const [username, setUsername] = useState('');
  const [answers, setAnswers] = useState(new Map());
  const [answered, setAnswered] = useState(false);
  const [answerSelected, setAnswerSelected] = useState('');
  const [resultsSent, setResultsSent] = useState(false);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const prepareResultsToObject = (username, answers) => {
    let finalObject = { username: username, answers: [] };
    answers.forEach((value, key) => {
      finalObject.answers.push(value);
    });
    console.log(`Returning: ${finalObject}`);
    return finalObject;
  };

  const onClickAnswer = () => {
    setAnswered(true);
    let newMap = new Map(answers);
    //console.log("Pushing new answer " + polledData.question.id)
    newMap.set(polledData.question.id, {
      answered: true,
      questionId: polledData.question.id,
      optionSelected: answerSelected,
    });
    setAnswers(new Map(newMap));
    setAnswerSelected('');
    console.log(answers);
  };

  //First ever poll once to render, mainly check for connection
  useEffect(() => {
    fetch('http://localhost:3001/question/poll')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setIsLoading(false);
        setPolledData(data);
        setAnswered(false);
        if (polledData.status == 'started') {
          let answersMap = new Map();
          setAnswers(answersMap);
          setResultsSent(false);
          console.log('first map saved');
          console.log(answers);
        }
      });
  }, []);

  //three second polling, refreshes questions and button state
  useInterval(() => {
    if (!isLoading) {
      fetch('http://localhost:3001/question/poll')
        .then(response => response.json())
        .then(data => {
          debugger;
          console.debug(data);
          console.debug(answers);
          setPolledData(data);
          //console.debug("ST4 (polledData.status == 'finished'): " + (polledData.status == 'finished'));
          //console.debug("ST4 (!resultsSent):" + (!resultsSent));

          //Si ya inició ya había contestado con respuestas
          // resetea estado
          if (
            polledData.status == 'started' &&
            resultsSent &&
            answers.size > 0
          ) {
            setAnswered(false);
            setResultsSent(false);
            setAnswers(new Map());
            console.log('ST0');
          }

          //Si ya inició y no he contestado nada:
          //El mapa es de tamaño cero. Activa boton para responder
          if (
            polledData.status == 'started' &&
            !answered &&
            answers.size == 0
          ) {
            setAnswered(false);
            setResultsSent(false);
            console.log('ST1');
          }

          //Si ya inició y ya contesté y se mantiene la pregunta polleada
          //con la que tengo en mi mapa de respuestas se mantiene en contestado
          if (
            polledData.status == 'started' &&
            answered &&
            typeof answers.get(polledData.question.id) != 'undefined'
          ) {
            setAnswered(true);
            setResultsSent(false);
            console.log('ST2');
          }

          //Si ya inició y ya contesté, y llega una pregunta nueva:
          //cuando el id de la pregunta no está en el mapa
          if (
            polledData.status == 'started' &&
            answered &&
            answers.size > 0 &&
            typeof answers.get(polledData.question.id) === 'undefined'
          ) {
            setAnswered(false);
            setResultsSent(false);
            console.log('ST3');
            setAnswerSelected('');
          }

          //Si ya inició y ya contesté, y llega una pregunta nueva:
          //cuando el id de la pregunta no está en el mapa
          if (polledData.status == 'finished' && !resultsSent) {
            console.log('ST4');
            let results = prepareResultsToObject(username, answers);
            console.log('Sending results: ' + JSON.stringify(results));

            fetch('http://localhost:3001/answer/', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(results),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Results Sent: ' + JSON.stringify(data));
                setResultsSent(true);
              })
              .catch(error => {
                console.error('There was an error!', error);
              });
          }
        });
    }
  }, 3000);

  const handleUsername = username => {
    debugger;
    console.log(username);
    setUsername(username);
  };

  //Cargando
  if (isLoading) {
    return (
      <div className="bx--grid quizes-page">
        <div id="r1" className="bx--row">
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <h1 className="quizes-page__heading">Friday Quizes</h1>
          </div>
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <CircleFilled20 className="offline-status" id="circle" />
            <span className="top-messages">&nbsp; Estás fuera de línea.</span>
            <br />
          </div>
        </div>
      </div>
    );
  } //when loading

  //Estado standby. Ingreso de usuario
  if (polledData.status == 'standby') {
    return (
      <div className="bx--grid quizes-page">
        <div className="bx--row">
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <h1 className="quizes-page__heading">Friday Quizes</h1>
          </div>
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <CircleFilled20 className="online-status" />
            <span className="top-messages">&nbsp; Listos para empezar</span>
            <br />
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2">
            <TextInput
              helperText="Este usuario será usado en tu calificación."
              id="textUsername"
              invalidText="A valid value is required"
              labelText="Tu nombre de usuario"
              placeholder="Ej. Rob Thomas"
              value={username}
              onChange={evt => setUsername(evt.target.value)}
            />
          </div>
          <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2 quizes-page__r1 button-ready">
            {/* <Button kind="secondary" size="default" onClick={handleBegin}>
            Iniciar
          </Button> */}
          </div>
        </div>
      </div>
    );
  }

  if (polledData.status == 'finished') {
    return (
      // when
      //when not loading
      <div className="bx--grid quizes-page">
        <div className="bx--row">
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <h1 className="quizes-page__heading">Friday Quizes</h1>
          </div>
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <CircleFilled20 className="online-status" />
            <span className="top-messages">&nbsp; Terminado</span>
            <br />
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2">
            <TextInput
              helperText="Este usuario será usado en tu calificación."
              id="textUsername"
              invalidText="A valid value is required"
              labelText="Tu nombre de usuario"
              placeholder="Ej. Rob Thomas"
              value={username}
              onChange={evt => setUsername(evt.target.value)}
            />
          </div>
          <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2 quizes-page__r1 ">
            {/* <Button kind="secondary" size="default">
              Iniciar
            </Button> */}
          </div>
        </div>
        <div className="bx--row quizes-page__r1">
          <div className="bx--col finish-message">
            La sesión ha terminado. Gracias por participar. Busca al
            organizador(a) para ver tus resultados.
          </div>
        </div>
      </div>
    );
  }
  // when started (Questions Displayed, start counter)
  if (polledData.status == 'started') {
    return (
      <div className="bx--grid quizes-page">
        <div className="bx--row">
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <h1 className="quizes-page__heading">Friday Quizes</h1>
          </div>
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
          <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
            <CircleFilled20 className="online-status" />
            <span className="top-messages">&nbsp; En progreso</span>
            <br />
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2">
            <TextInput
              helperText="Este usuario será usado en tu calificación."
              id="textUsername"
              invalidText="A valid value is required"
              labelText="Tu nombre de usuario"
              placeholder="Ej. Rob Thomas"
              value={username}
              onChange={evt => setUsername(evt.target.value)}
            />
          </div>
          <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2 quizes-page__r1">
            {/* <Button kind="secondary" size="default">
            Iniciar
          </Button> */}
          </div>
        </div>
        <QuizesPanel
          questionId={polledData.id}
          questionText={polledData.question.text}
          qOptions={polledData.question.options}
          onAnswerSelected={setAnswerSelected}
          id={polledData.id}
        />
        <div className="bx--row">
          <div className="bx--col" />
          <div className="bx--col" />

          <div className="bx--col quizes-page__answer_button_row">
            <Button
              kind="primary"
              size="default"
              className="quizes-page__answer_button"
              onClick={onClickAnswer}
              disabled={answered}>
              Responder
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    // when started
    //when not loading
    <div className="bx--grid quizes-page">
      <div className="bx--row">
        <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
          <h1 className="quizes-page__heading">Friday Quizes</h1>
        </div>
        <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
        <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1" />
        <div className="bx--col-lg-4 bx--col-md-2 bx--col-sm-1 quizes-page__r1">
          <CircleFilled20 className="online-status" />
          <span className="top-messages">&nbsp; En progreso</span>
          <br />
        </div>
      </div>
      <div className="bx--row">
        <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2">
          Undefined State DELETE
          <TextInput
            helperText="Este usuario será usado en tu calificación."
            id="textUsername"
            invalidText="A valid value is required"
            labelText="Tu nombre de usuario"
            placeholder="Ej. Rob Thomas"
            value={username}
            onChange={evt => setUsername(evt.target.value)}
          />
        </div>
        <div className="bx--col-lg-7 bx--col-md-5 bx--col-sm-2 quizes-page__r1">
          {/* <Button kind="secondary" size="default">
            Iniciar
          </Button> */}
        </div>
      </div>
      {/* <QuizesPanel
        questionId="NA"
        questionText="NA"
        questionTime="NA"
        qOptions={qOptions}
        id="qPanel"
      /> */}
      <div className="bx--row">
        <div className="bx--col" />
        <div className="bx--col" />
        <div className="bx--col" />
        <div className="bx--col">
          <Button kind="primary" size="default">
            Responder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizesPage;

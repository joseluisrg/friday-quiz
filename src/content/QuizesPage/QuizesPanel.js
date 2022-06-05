import React, { useEffect, useState, useRef } from 'react';
import { RadioButtonGroup, RadioButton } from 'carbon-components-react';
import { propsOfNode } from 'enzyme/build/Utils';

const QuizesPanel = ({
  questionId,
  questionText,
  qOptions,
  onAnswerSelected,
}) => {
  const handleOnChange = answer => {
    onAnswerSelected(answer);
  };

  return (
    <div id={questionId} className="bx--row quizes-page__panel">
      <div className="bx--col-lg-8 bx--col-lg-8 quizes-page__question">
        <div className="quizes-page__question_small">Pregunta</div>
        {questionText}
      </div>
      <div className="bx--col-lg-8 bx--col-lg-8 quizes-page__option">
        <RadioButtonGroup
          legendText="Radio button heading"
          name="radio-button-group"
          onChange={handleOnChange}
          defaultSelected="-1"
          className="quizes-page__option">
          {qOptions.map(qOption => (
            <RadioButton
              labelText={qOption.text}
              value={qOption.id}
              key={qOption.id}
              className="quizes-page__question_small"
            />
          ))}
        </RadioButtonGroup>
      </div>
    </div>
  );
};

export default QuizesPanel;

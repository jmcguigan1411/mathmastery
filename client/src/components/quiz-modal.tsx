import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Clock, Lightbulb, Flag } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

interface QuizModalProps {
  questions: QuizQuestion[];
  onClose: () => void;
  lessonTitle: string;
}

export default function QuizModal({ questions, onClose, lessonTitle }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, quizCompleted]);

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-4">No Quiz Available</h2>
              <p className="text-slate-600 mb-6">This lesson doesn't have a quiz yet.</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    setShowExplanation(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;
    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        totalScore += question.points;
      }
    });
    
    setScore(totalScore);
    setQuizCompleted(true);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  if (quizCompleted) {
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                percentage >= 80 ? 'bg-green-100' :
                percentage >= 60 ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  percentage >= 80 ? 'text-green-600' :
                  percentage >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {percentage}%
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
              <p className="text-slate-600">
                You scored {score} out of {maxScore} points
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Correct Answers:</span>
                <span className="font-medium">
                  {questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} / {questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time Taken:</span>
                <span className="font-medium">{formatTime(300 - timeRemaining)}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={onClose} variant="outline">
                Return to Lesson
              </Button>
              <Button onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setQuizCompleted(false);
                setShowExplanation(false);
                setTimeRemaining(300);
                setScore(0);
              }}>
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Quiz Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">{lessonTitle} Quiz</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm text-slate-600 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
          </div>
          <Progress value={progressPercentage} className="mt-3" />
        </div>

        {/* Quiz Content */}
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Multiple Choice Answers */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswers[currentQuestion.id] === optionLetter;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full p-4 h-auto justify-start transition-all duration-200 ${
                    isSelected ? 'border-primary bg-blue-50' : 'border-slate-200 hover:border-primary hover:bg-blue-50'
                  }`}
                  onClick={() => handleSelectAnswer(optionLetter)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center mr-4 transition-all ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300'
                    }`}>
                      {optionLetter}
                    </div>
                    <span className="text-slate-700">{option}</span>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && currentQuestion.explanation && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Quiz Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-3">
              {currentQuestion.explanation && (
                <Button variant="ghost" size="sm" onClick={handleShowExplanation}>
                  <Lightbulb className="mr-1 h-4 w-4" />
                  Show explanation
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Flag className="mr-1 h-4 w-4" />
                Report issue
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!selectedAnswers[currentQuestion.id]}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

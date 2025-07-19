import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import InteractiveGraph from "@/components/interactive-graph";
import QuizModal from "@/components/quiz-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  HelpCircle, 
  Check,
  Lock,
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";

export default function Lesson() {
  const { courseId, lessonId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showQuiz, setShowQuiz] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const { data: course } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
  });

  const { data: lessons = [] } = useQuery({
    queryKey: [`/api/courses/${courseId}/lessons`],
  });

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}`],
  });

  const { data: quizQuestions = [] } = useQuery({
    queryKey: [`/api/lessons/${lessonId}/quiz`],
    enabled: !!lessonId,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: [`/api/user/progress/course/${courseId}`],
  });

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateProgressMutation = useMutation({
    mutationFn: async (progress: any) => {
      await apiRequest("POST", "/api/user/progress", progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/progress/course/${courseId}`] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  if (lessonLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="animate-pulse p-8">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-slate-200 rounded mb-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Lesson Not Found</h1>
          <Link href={`/course/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentLessonIndex = lessons.findIndex((l: any) => l.id === parseInt(lessonId || "1"));
  const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;
  
  const currentProgress = userProgress.find(p => p.lessonId === lesson.id);
  const lessonProgress = currentProgress ? (currentProgress.completed ? 100 : 75) : 0;

  const completedLessons = userProgress.filter(p => p.completed).length;
  const courseProgress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  const handleCompleteLesson = () => {
    updateProgressMutation.mutate({
      courseId: parseInt(courseId || "1"),
      lessonId: lesson.id,
      completed: true,
      timeSpent: Math.round(timeSpent / 60), // Convert to minutes
    });

    toast({
      title: "Lesson Completed!",
      description: "Great job! You've completed this lesson.",
    });

    if (nextLesson) {
      setTimeout(() => {
        window.location.href = `/course/${courseId}/lesson/${nextLesson.id}`;
      }, 1500);
    }
  };

  const handleStartQuiz = () => {
    if (quizQuestions.length > 0) {
      setShowQuiz(true);
    } else {
      toast({
        title: "No Quiz Available",
        description: "This lesson doesn't have a quiz.",
      });
    }
  };

  // Parse lesson content (assuming it's JSON)
  let lessonContent;
  try {
    lessonContent = lesson.content ? JSON.parse(lesson.content) : {};
  } catch (e) {
    lessonContent = { theory: lesson.description || "" };
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="flex h-screen">
        {/* Lesson Sidebar */}
        <aside className="w-80 bg-white shadow-lg border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <Link href={`/course/${courseId}`}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Button>
            </Link>
            <h2 className="text-xl font-bold text-slate-900">{course?.title}</h2>
            <p className="text-sm text-slate-600">Lesson {lesson.position} of {lessons.length}</p>
            <Progress value={courseProgress} className="mt-2" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {lessons.map((l: any, index: number) => {
                const progress = userProgress.find(p => p.lessonId === l.id);
                const isCompleted = progress?.completed || false;
                const isCurrent = l.id === lesson.id;
                const isLocked = index > 0 && !userProgress.find(p => p.lessonId === lessons[index - 1]?.id)?.completed;
                
                return (
                  <div key={l.id} className="mb-2">
                    <div className={`
                      flex items-center p-3 rounded-lg cursor-pointer group transition-colors
                      ${isCurrent ? 'bg-blue-50 border-l-4 border-primary' : 
                        isCompleted ? 'hover:bg-green-50' :
                        isLocked ? 'opacity-60' : 'hover:bg-slate-50'}
                    `}>
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium
                        ${isCompleted ? 'bg-secondary text-white' :
                          isCurrent ? 'bg-primary text-white' :
                          isLocked ? 'bg-slate-300 text-slate-600' :
                          'bg-slate-300 text-slate-600'}
                      `}>
                        {isCompleted ? <Check className="h-4 w-4" /> :
                         isLocked ? <Lock className="h-4 w-4" /> :
                         l.position}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${isCurrent ? 'text-primary' : 'text-slate-900'}`}>
                          {l.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {l.estimatedMinutes} min{isCurrent ? ' • Current' : ''}
                        </p>
                      </div>
                      {isLocked && <Lock className="h-4 w-4 text-slate-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Lesson Content */}
        <main className="flex-1 flex flex-col">
          {/* Lesson Header */}
          <header className="bg-white border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
                <p className="text-slate-600 mt-1">{lesson.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Lesson Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* Theory Section */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Understanding Linear Functions</h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-slate-700 mb-4">
                      A linear function can be written in the form <strong>y = mx + b</strong>, where:
                    </p>
                    <ul className="space-y-2 text-slate-700 mb-6">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        <strong>m</strong> is the slope (rate of change)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                        <strong>b</strong> is the y-intercept (where the line crosses the y-axis)
                      </li>
                    </ul>

                    <div className="bg-slate-50 rounded-lg p-4 mb-6 text-center">
                      <div className="text-2xl font-mono text-slate-800">y = mx + b</div>
                      <p className="text-sm text-slate-600 mt-2">Standard form of a linear equation</p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Interactive Visualization */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Interactive Graph Explorer</h2>
                <Card>
                  <CardContent className="p-6">
                    <InteractiveGraph />
                  </CardContent>
                </Card>
              </section>

              {/* Practice Problems */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Practice Problems</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium text-slate-900">Problem 1 of 3</h3>
                      <span className="text-sm bg-blue-100 text-primary px-2 py-1 rounded">5 points</span>
                    </div>
                    
                    <p className="text-slate-700 mb-4">
                      What is the slope of the line passing through points (2, 4) and (6, 12)?
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Button variant="outline" className="p-3 h-auto justify-start">
                        <span className="font-medium text-slate-700 mr-2">A.</span> m = 1
                      </Button>
                      <Button variant="outline" className="p-3 h-auto justify-start border-primary bg-blue-50">
                        <span className="font-medium text-slate-700 mr-2">B.</span> m = 2
                      </Button>
                      <Button variant="outline" className="p-3 h-auto justify-start">
                        <span className="font-medium text-slate-700 mr-2">C.</span> m = 3
                      </Button>
                      <Button variant="outline" className="p-3 h-auto justify-start">
                        <span className="font-medium text-slate-700 mr-2">D.</span> m = 4
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" className="text-primary">
                        <Lightbulb className="mr-1 h-4 w-4" />
                        Need a hint?
                      </Button>
                      <Button onClick={handleStartQuiz}>
                        Take Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Lesson Navigation */}
              <div className="flex items-center justify-between py-6 border-t border-slate-200">
                <div>
                  {previousLesson ? (
                    <Link href={`/course/${courseId}/lesson/${previousLesson.id}`}>
                      <Button variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous Lesson
                      </Button>
                    </Link>
                  ) : (
                    <div></div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-1">Lesson Progress</div>
                  <Progress value={lessonProgress} className="w-32" />
                </div>
                
                <div>
                  {currentProgress?.completed ? (
                    nextLesson ? (
                      <Link href={`/course/${courseId}/lesson/${nextLesson.id}`}>
                        <Button>
                          Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/course/${courseId}`}>
                        <Button className="bg-secondary text-white hover:bg-green-700">
                          Course Complete!
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Button onClick={handleCompleteLesson} disabled={updateProgressMutation.isPending}>
                      {updateProgressMutation.isPending ? "Completing..." : "Complete Lesson"}
                      <Check className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          questions={quizQuestions}
          onClose={() => setShowQuiz(false)}
          lessonTitle={lesson.title}
        />
      )}
    </div>
  );
}

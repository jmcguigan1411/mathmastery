import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, BookOpen, Play, Check, Lock } from "lucide-react";
import { Link } from "wouter";

export default function Course() {
  const { id } = useParams();
  const courseId = parseInt(id || "1");

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}/lessons`],
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: [`/api/user/progress/course/${courseId}`],
  });

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = userProgress.filter(p => p.completed).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        {/* Course Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{course.title}</h1>
                <p className="text-slate-600 mb-6">{course.description}</p>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center text-slate-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{course.estimatedHours}h estimated</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{lessons.length} lessons</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm text-slate-600">{completedLessons} of {lessons.length} completed</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-secondary h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <Link href={`/course/${courseId}/lesson/${lessons[0]?.id || 1}`}>
                  <Button size="lg" className="bg-primary text-white hover:bg-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    {completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </Link>
              </div>

              <div className="lg:w-80">
                <div className={`h-48 rounded-lg flex items-center justify-center ${
                  course.level === 'beginner' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                  course.level === 'intermediate' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                  'bg-gradient-to-br from-purple-400 to-purple-600'
                }`}>
                  <i className={`text-white text-6xl opacity-50 ${
                    course.icon || 'fas fa-calculator'
                  }`}></i>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Course Lessons</h2>
            <div className="space-y-3">
              {lessons.map((lesson: any, index: number) => {
                const progress = userProgress.find(p => p.lessonId === lesson.id);
                const isCompleted = progress?.completed || false;
                const isLocked = index > 0 && !userProgress.find(p => p.lessonId === lessons[index - 1]?.id)?.completed;
                
                return (
                  <div key={lesson.id} className={`
                    flex items-center p-4 rounded-lg border transition-colors
                    ${isCompleted ? 'bg-green-50 border-green-200' : 
                      isLocked ? 'bg-slate-50 border-slate-200 opacity-60' : 
                      'bg-white border-slate-200 hover:bg-slate-50'}
                  `}>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mr-4 text-sm font-medium
                      ${isCompleted ? 'bg-secondary text-white' :
                        isLocked ? 'bg-slate-300 text-slate-600' :
                        'bg-primary text-white'}
                    `}>
                      {isCompleted ? <Check className="h-4 w-4" /> :
                       isLocked ? <Lock className="h-4 w-4" /> :
                       lesson.position}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
                        {lesson.title}
                      </h3>
                      <p className={`text-sm ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                        {lesson.estimatedMinutes} min • {lesson.description}
                      </p>
                    </div>

                    <div className="ml-4">
                      {isLocked ? (
                        <Lock className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Link href={`/course/${courseId}/lesson/${lesson.id}`}>
                          <Button variant={isCompleted ? "secondary" : "default"} size="sm">
                            {isCompleted ? "Review" : "Start"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

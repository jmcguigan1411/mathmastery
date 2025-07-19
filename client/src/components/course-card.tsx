import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Star } from "lucide-react";
import { Link } from "wouter";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    level: string;
    estimatedHours: number;
    totalLessons: number;
    progressPercentage?: number;
    completedLessons?: number;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const getGradientClass = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'from-green-400 to-green-600';
      case 'intermediate':
        return 'from-blue-400 to-blue-600';
      case 'advanced':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-slate-400 to-slate-600';
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'fas fa-calculator';
      case 'intermediate':
        return 'fas fa-shapes';
      case 'advanced':
        return 'fas fa-infinity';
      default:
        return 'fas fa-book';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group">
      <Link href={`/course/${course.id}`}>
        <div className={`h-48 bg-gradient-to-br ${getGradientClass(course.level)} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className={`${getIcon(course.level)} text-white text-6xl opacity-50`}></i>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="mr-1 h-4 w-4" />
            <span>{course.estimatedHours}h</span>
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <BookOpen className="mr-1 h-4 w-4" />
            <span>{course.totalLessons} lessons</span>
          </div>
        </div>
        
        {course.progressPercentage !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm text-slate-600">{course.progressPercentage}%</span>
            </div>
            <Progress value={course.progressPercentage} />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-secondary">
            <Star className="mr-1 h-4 w-4 fill-current" />
            <span>4.9</span>
          </div>
          
          <Link href={`/course/${course.id}`}>
            <Button 
              size="sm" 
              className={
                course.progressPercentage && course.progressPercentage > 0
                  ? "bg-secondary text-white hover:bg-green-700"
                  : "bg-primary text-white hover:bg-blue-700"
              }
            >
              {course.progressPercentage && course.progressPercentage > 0 ? 'Continue' : 'Start'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

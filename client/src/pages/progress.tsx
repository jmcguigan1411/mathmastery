import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Flame, 
  GraduationCap, 
  Clock, 
  Star,
  Target,
  Calendar
} from "lucide-react";

export default function ProgressPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: isAuthenticated,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
    enabled: isAuthenticated,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated,
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/user/achievements"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="animate-pulse max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate course progress
  const courseProgress = courses.map((course: any) => {
    const progress = userProgress.filter((p: any) => p.courseId === course.id);
    const completed = progress.filter((p: any) => p.completed).length;
    const total = course.totalLessons || 1;
    return {
      ...course,
      progressPercentage: Math.round((completed / total) * 100),
      completedLessons: completed,
      totalLessons: total,
      timeSpent: progress.reduce((acc: number, p: any) => acc + (p.timeSpent || 0), 0),
    };
  });

  // Mock weekly activity data (in a real app, this would come from the API)
  const weeklyActivity = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 60 },
    { day: 'Thu', minutes: 15 },
    { day: 'Fri', minutes: 52 },
    { day: 'Sat', minutes: 12 },
    { day: 'Sun', minutes: 0 },
  ];

  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Learning Progress</h1>
          <p className="text-slate-600">Track your mathematical journey and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="text-orange-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{userStats?.currentStreak || 0}</p>
                  <p className="text-sm text-slate-600">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Trophy className="text-secondary text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{userStats?.totalXP || 0}</p>
                  <p className="text-sm text-slate-600">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-primary text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{userStats?.lessonsCompleted || 0}</p>
                  <p className="text-sm text-slate-600">Lessons Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Clock className="text-accent text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{Math.round((userStats?.totalStudyTime || 0) / 60)}h</p>
                  <p className="text-sm text-slate-600">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Progress Panel */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Course Progress</h2>
                <div className="space-y-6">
                  {courseProgress.map((course: any) => (
                    <div key={course.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-slate-900">{course.title}</h3>
                        <span className={`text-sm font-medium ${
                          course.progressPercentage >= 80 ? 'text-secondary' :
                          course.progressPercentage >= 50 ? 'text-primary' :
                          'text-slate-600'
                        }`}>
                          {course.progressPercentage}% Complete
                        </span>
                      </div>
                      <Progress value={course.progressPercentage} className="mb-2" />
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
                        <span>{Math.round(course.timeSpent / 60)}h {course.timeSpent % 60}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Weekly Activity</h2>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-slate-500 mb-2">{day.day}</div>
                      <div 
                        className="w-8 bg-secondary rounded-sm mx-auto"
                        style={{ 
                          height: `${Math.max(10, (day.minutes / maxMinutes) * 80)}px`,
                          opacity: day.minutes === 0 ? 0.2 : 0.6 + (day.minutes / maxMinutes) * 0.4
                        }}
                      ></div>
                      <div className="text-xs text-slate-600 mt-1">{day.minutes}m</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Achievements & Goals */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Achievements</h2>
                <div className="space-y-3">
                  {achievements.length > 0 ? (
                    achievements.slice(0, 3).map((achievement: any) => (
                      <div key={achievement.id} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-10 h-10 bg-success text-white rounded-full flex items-center justify-center">
                          <Star className="text-sm" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-slate-900">{achievement.title}</h4>
                          <p className="text-xs text-slate-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No achievements yet</p>
                      <p className="text-xs">Complete lessons to earn your first badge!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Learning Goals</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Daily Goal</span>
                      <span className="text-sm text-slate-600">30 min</span>
                    </div>
                    <Progress value={80} className="mb-1" />
                    <p className="text-xs text-slate-600">24 min completed</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Weekly Goal</span>
                      <span className="text-sm text-slate-600">3 hours</span>
                    </div>
                    <Progress value={65} className="mb-1" />
                    <p className="text-xs text-slate-600">1h 57m completed</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Monthly Goal</span>
                      <span className="text-sm text-slate-600">Complete 1 Course</span>
                    </div>
                    <Progress value={45} className="mb-1" />
                    <p className="text-xs text-slate-600">45% progress on Algebra Basics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

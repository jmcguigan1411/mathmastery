import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import CourseCard from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Clock, Play } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  // Calculate course progress
  const courseProgress = courses.map((course: any) => {
    const progress = userProgress.filter((p: any) => p.courseId === course.id);
    const completed = progress.filter((p: any) => p.completed).length;
    const total = course.totalLessons || 1;
    return {
      ...course,
      progressPercentage: Math.round((completed / total) * 100),
      completedLessons: completed,
    };
  });

  const featuredCourses = courseProgress.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Welcome back, {user?.firstName || 'Learner'}!
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Continue your mathematical journey with interactive lessons and challenging problems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/course/1/lesson/1">
                <Button size="lg" className="bg-primary text-white hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Continue Learning
                </Button>
              </Link>
              <Link href="/progress">
                <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
                  View Progress
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        {userStats && (
          <section className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Trophy className="text-orange-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">{userStats.currentStreak || 0}</p>
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
                    <p className="text-2xl font-bold text-slate-900">{userStats.totalXP || 0}</p>
                    <p className="text-sm text-slate-600">Total XP</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Users className="text-primary text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900">{userStats.lessonsCompleted || 0}</p>
                    <p className="text-sm text-slate-600">Lessons</p>
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
                    <p className="text-2xl font-bold text-slate-900">{Math.round((userStats.totalStudyTime || 0) / 60)}h</p>
                    <p className="text-sm text-slate-600">Study Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Learning Path Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Your Learning Paths</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-calculator text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Beginner</h3>
                <p className="text-slate-600 mb-4">Master the fundamentals with arithmetic, basic algebra, and foundational concepts.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">6 courses</span>
                  <span className="text-sm text-secondary font-medium">65% Complete</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <Link href="/courses?level=beginner">
                  <Button className="w-full bg-secondary text-white hover:bg-green-700">
                    Continue Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-shapes text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Intermediate</h3>
                <p className="text-slate-600 mb-4">Explore geometry, trigonometry, and linear equations with interactive visualizations.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">8 courses</span>
                  <span className="text-sm text-primary font-medium">35% Complete</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <Link href="/courses?level=intermediate">
                  <Button className="w-full bg-primary text-white hover:bg-blue-700">
                    Start Journey
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-infinity text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced</h3>
                <p className="text-slate-600 mb-4">Master calculus, linear algebra, statistics, and advanced mathematical concepts.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">10 courses</span>
                  <span className="text-sm text-slate-500 font-medium">Locked</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <Button variant="secondary" className="w-full bg-slate-300 text-slate-500 cursor-not-allowed" disabled>
                  Complete Intermediate
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Featured Courses</h2>
            <Link href="/courses">
              <Button variant="ghost" className="text-primary hover:text-blue-700 font-medium">
                View All <i className="fas fa-arrow-right ml-1"></i>
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-16 bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredCourses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </div>
        </section>

        {/* Daily Challenge Section */}
        <section className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <Trophy className="text-yellow-400 text-2xl mr-3" />
                <h3 className="text-2xl font-bold">Daily Challenge</h3>
              </div>
              <h4 className="text-xl font-semibold mb-2">Quadratic Equation Explorer</h4>
              <p className="text-blue-100 mb-4">
                Solve for the roots of ax² + bx + c = 0 where a = 2, b = -7, and c = 3. 
                Use the interactive graph to visualize your solution!
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Users className="text-blue-200 mr-2" />
                  <span className="text-sm">1,247 participants today</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-blue-200 mr-2" />
                  <span className="text-sm">14h 32m remaining</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 text-center">
              <Button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-200">
                <Play className="mr-2 h-4 w-4" />
                Take Challenge
              </Button>
              <p className="text-sm text-blue-200 mt-2">Earn 50 XP + Badge</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

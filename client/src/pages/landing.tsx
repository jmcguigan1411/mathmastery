import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SquareRadical, Calculator, Shapes, Infinity, Play, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <SquareRadical className="text-primary text-2xl" />
              <span className="ml-2 text-xl font-bold text-slate-900">MathLearn</span>
            </div>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Master Mathematics Through
            <span className="text-primary"> Interactive Learning</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Explore mathematics from basic arithmetic to advanced calculus with visual examples, 
            interactive problems, and personalized progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = '/api/login'}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Learning
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Choose Your Learning Path</h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="text-secondary text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Beginner</h3>
              <p className="text-slate-600 mb-4">
                Master the fundamentals with arithmetic, basic algebra, and foundational concepts.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">6 courses</span>
                <span className="text-sm text-secondary font-medium">~3 months</span>
              </div>
              <Button className="w-full bg-secondary text-white hover:bg-green-700">
                Start Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shapes className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Intermediate</h3>
              <p className="text-slate-600 mb-4">
                Explore geometry, trigonometry, and linear equations with interactive visualizations.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">8 courses</span>
                <span className="text-sm text-primary font-medium">~5 months</span>
              </div>
              <Button className="w-full bg-primary text-white hover:bg-blue-700">
                Start Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Infinity className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced</h3>
              <p className="text-slate-600 mb-4">
                Master calculus, linear algebra, statistics, and advanced mathematical concepts.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">10 courses</span>
                <span className="text-sm text-accent font-medium">~8 months</span>
              </div>
              <Button variant="secondary" className="w-full bg-slate-300 text-slate-500 cursor-not-allowed" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why Choose MathLearn?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Interactive Visualizations</h3>
              <p className="text-slate-600">
                Learn with dynamic graphs, animations, and hands-on simulations that make complex concepts clear.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-secondary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Progress Tracking</h3>
              <p className="text-slate-600">
                Monitor your learning journey with detailed analytics, streaks, and achievement badges.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Adaptive Learning</h3>
              <p className="text-slate-600">
                Personalized quizzes and challenges that adapt to your skill level and learning pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Math Skills?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of learners who have already started their mathematical journey with us.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-blue-50 transform hover:scale-105 transition-all duration-200"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started for Free
          </Button>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: number; // in seconds
  instructions: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Step 1: Select Your Headline",
    description: "Click on the main headline text in your GoHighLevel funnel builder",
    image: "/assets/ghl-step1.jpg",
    duration: 8,
    instructions: [
      "Open your funnel in GoHighLevel editor",
      "Navigate to the page you want to make dynamic",
      "Click directly on your main headline text",
      "You'll see the element get selected with a blue border"
    ]
  },
  {
    id: 2,
    title: "Step 2: Add Custom Attribute",
    description: "Find the element properties panel and add the data-copy-element attribute",
    image: "/assets/ghl-step2.jpg",
    duration: 12,
    instructions: [
      "Look for 'Element Settings' or 'Properties' panel (usually on the right)",
      "Find 'Custom Attributes' or 'HTML Attributes' section",
      "Click 'Add Attribute' or the '+' button",
      "Enter Name: 'data-copy-element'",
      "Enter Value: 'headline'",
      "Click 'Save' or 'Apply'"
    ]
  },
  {
    id: 3,
    title: "Step 3: Repeat for All Elements",
    description: "Add the same attribute to buttons, descriptions, and other dynamic content",
    image: "/assets/ghl-complete.jpg",
    duration: 10,
    instructions: [
      "Select your CTA button and add data-copy-element='cta-button'",
      "Select description text and add data-copy-element='description'",
      "For each element, use a unique identifier like:",
      "• Headlines: 'headline' or 'main-headline'",
      "• Buttons: 'cta-button' or 'primary-cta'", 
      "• Descriptions: 'description' or 'subheadline'",
      "Save your funnel when complete"
    ]
  }
];

export const VideoTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const currentTutorialStep = tutorialSteps[currentStep];
  const totalSteps = tutorialSteps.length;

  // Auto-advance simulation (not real video)
  useState(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (currentTutorialStep.duration * 10));
          
          if (newProgress >= 100) {
            if (currentStep < totalSteps - 1) {
              setCurrentStep(prev => prev + 1);
              setProgress(0);
              return 0;
            } else {
              setIsPlaying(false);
              setHasCompleted(true);
              toast.success('Tutorial Complete! 🎉 You\'re ready to set up dynamic content in GoHighLevel', {theme: 'colored'});
              return 100;
            }
          }
          
          return newProgress;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  });

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    setHasCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-primary" />
            <span>Video Tutorial: GoHighLevel Dynamic Content Setup</span>
            {hasCompleted && <CheckCircle className="w-5 h-5 text-primary" />}
          </CardTitle>
          <Badge variant="secondary">
            Step {currentStep + 1} of {totalSteps}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video Player Area */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <Image 
            src={currentTutorialStep.image} 
            alt={currentTutorialStep.title}
            width={800}
            height={400}
            className="w-full h-auto max-h-96 object-contain bg-gray-900"
            priority
          />
          
          {/* Play Overlay */}
          {!isPlaying && progress === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Button 
                size="lg" 
                className="rounded-full w-16 h-16 p-0"
                onClick={togglePlayPause}
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-50">
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={restart}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Step Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {currentTutorialStep.title}
            </h3>
            <p className="text-muted-foreground mt-1">
              {currentTutorialStep.description}
            </p>
          </div>

          {/* Step Instructions */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium text-sm text-foreground mb-2">Instructions:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {currentTutorialStep.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-medium">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Duration: {formatTime(currentTutorialStep.duration)}</span>
          <span>Progress: {Math.round(progress)}%</span>
        </div>

        {/* Next Steps */}
        {hasCompleted && (
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">🎉 Great job!</h4>
            <p className="text-sm text-muted-foreground">
              You've learned how to set up dynamic content in GoHighLevel. 
              Now test your funnel with UTM parameters to see the content change automatically!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
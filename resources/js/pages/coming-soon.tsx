import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';

interface Props {
    feature: string;
    [key: string]: unknown;
}

export default function ComingSoon({ feature }: Props) {
    return (
        <AppShell>
            <Head title={`${feature} - Coming Soon`} />
            
            <div className="max-w-2xl mx-auto">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4">
                            <Construction className="w-16 h-16 text-yellow-500" />
                        </div>
                        <CardTitle className="text-2xl">
                            {feature} Coming Soon! 🚧
                        </CardTitle>
                        <CardDescription>
                            We're working hard to bring you this feature. Stay tuned!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">
                            The <strong>{feature}</strong> feature is currently under development. 
                            We're building something amazing and will have it ready soon.
                        </p>
                        
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">What's coming:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Intuitive and user-friendly interface</li>
                                <li>• Full integration with your daily routine</li>
                                <li>• Advanced customization options</li>
                                <li>• Mobile-responsive design</li>
                            </ul>
                        </div>
                        
                        <Button 
                            onClick={() => window.history.back()}
                            className="mt-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
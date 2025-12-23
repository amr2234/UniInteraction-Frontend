import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle } from 'lucide-react';
import { useI18n } from '@/i18n';
import nafathLogo from '@/assets/Nafaz.png';

interface NafathActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (nationalId: string) => void;
}

export function NafathActivationDialog({ open, onOpenChange, onSuccess }: NafathActivationDialogProps) {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState<'input' | 'verification' | 'success'>('input');
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep('input');
      setNationalId('');
      setError('');
      setRandomNumber('');
      setIsLoading(false);
    }
  }, [open]);

  const validateNationalId = (): boolean => {
    if (!nationalId) {
      setError(t('validation.nationalIdRequired'));
      return false;
    }
    if (!/^[0-9]{10}$/.test(nationalId)) {
      setError(t('validation.nationalIdFormat'));
      return false;
    }
    return true;
  };

  const generateRandomNumber = (): string => {
    return Math.floor(10 + Math.random() * 90).toString();
  };

  const handleStartActivation = async () => {
    if (!validateNationalId()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to initiate Nafath verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const randomNum = generateRandomNumber();
      setRandomNumber(randomNum);
      setCurrentStep('verification');
      
      // Start polling for verification
      startPolling();
    } catch (err) {
      setError(t('profile.nafathActivationError'));
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = () => {
    // Simulate polling - in real implementation, poll the backend
    const pollInterval = setInterval(async () => {
      // Simulate API check for Nafath confirmation
      // In production: const status = await checkNafathStatus(transactionId);
      
      // For demo: auto-approve after 5 seconds
      const shouldApprove = Math.random() > 0.5; // Simulate random approval
      
      if (shouldApprove) {
        clearInterval(pollInterval);
        setCurrentStep('success');
        
        // Call onSuccess after showing success message briefly
        setTimeout(() => {
          onSuccess(nationalId);
          onOpenChange(false);
        }, 2000);
      }
    }, 3000);

    // Stop polling after 3 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (currentStep !== 'success') {
        setError(t('profile.nafathTimeout'));
        setCurrentStep('input');
      }
    }, 180000);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleRetry = () => {
    setCurrentStep('input');
    setError('');
    setRandomNumber('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            {t('profile.activateNafath')}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Step 1: Enter National ID */}
          {currentStep === 'input' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="nafath-national-id">{t('form.nationalId')}</Label>
                <Input
                  id="nafath-national-id"
                  type="text"
                  value={nationalId}
                  onChange={(e) => {
                    setNationalId(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="1234567890"
                  className="mt-2"
                  dir="ltr"
                  maxLength={10}
                  onInput={(e) => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/[^0-9]/g, '');
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#6CAEBD] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[#2B2B2B]">
                    <p className="font-semibold mb-1">{t('auth.nafathInstructions')}</p>
                    <ul className="list-disc list-inside space-y-1 text-[#6F6F6F]">
                      <li>{t('auth.nafathStep1')}</li>
                      <li>{t('auth.nafathStep2')}</li>
                      <li>{t('auth.nafathStep3')}</li>
                      <li>{t('auth.nafathStep4')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  onClick={handleStartActivation} 
                  disabled={isLoading}
                  className="bg-[#115740] hover:bg-[#0d4230]"
                >
                  {isLoading ? t('common.loading') : t('auth.continueWithNafath')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Show Verification Number */}
          {currentStep === 'verification' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#4A9B8E] to-[#3A8A7E] rounded-3xl p-8 text-white shadow-lg">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <img src={nafathLogo} alt="نفاذ" className="h-16 rounded-2xl" />
                  </div>
                  
                  <p className="text-base font-semibold mb-4 text-white">
                    {t('auth.verificationNumber')}
                  </p>
                  
                  <div className="bg-white rounded-2xl py-8 px-6 mb-4">
                    <div className="text-8xl font-bold tracking-[0.3em] font-mono text-[#4A9B8E]">
                      {randomNumber || '00'}
                    </div>
                  </div>
                  
                  <p className="text-sm text-white font-medium">
                    {t('auth.matchNumber')}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-sm text-[#2B2B2B]">
                  <p className="font-semibold mb-2">{t('auth.nextSteps')}</p>
                  <ol className="list-decimal list-inside space-y-1 text-[#6F6F6F]">
                    <li>{t('auth.openNafathApp')}</li>
                    <li>{t('auth.checkSameNumber')}</li>
                    <li>{t('auth.confirmLogin')}</li>
                  </ol>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-2 h-2 bg-[#6CAEBD] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#6CAEBD] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#6CAEBD] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <p className="text-sm text-[#6F6F6F] mr-3">{t('auth.waitingConfirmation')}</p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#115740] mb-2">
                  {t('profile.nafathActivatedSuccess')}
                </h3>
                <p className="text-gray-600">
                  {t('profile.nafathActivatedSuccessDesc')}
                </p>
              </div>
            </div>
          )}

          {error && currentStep === 'input' && (
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outline" onClick={handleRetry}>
                {t('common.retry')}
              </Button>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

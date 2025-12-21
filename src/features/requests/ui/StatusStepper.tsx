import { CheckCircle, Circle } from "lucide-react";
import { Fragment } from "react";

interface Step {
  label: string;
  status: "completed" | "in-progress" | "pending";
  statusText: string;
}

interface StatusStepperProps {
  steps: Step[];
}

export function StatusStepper({ steps }: StatusStepperProps) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 my-6">
      <div className="flex items-center" >
        {steps.map((step, index) => (
          <Fragment key={index}>
            {/* Step Content */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Circle Icon */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${step.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : step.status === "in-progress"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                {step.status === "completed" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>

              {/* Step Info */}
              <div className="mt-3 text-center max-w-[120px]">
                <p className="text-gray-900 mb-1">{step.label}</p>
                <p
                  className={`text-sm
                    ${step.status === "completed"
                      ? "text-green-600"
                      : step.status === "in-progress"
                        ? "text-orange-600"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.statusText}
                </p>
              </div>
            </div>

            {/* Line - only show if not the last item */}
            {index < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 ${
                  step.status === "completed"
                    ? "bg-green-300" 
                    : "bg-gray-200"
                  }`}
                style={{ marginBottom: '56px' }}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

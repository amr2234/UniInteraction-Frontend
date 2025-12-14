import React from "react";
import { RequestForm } from "../Form/RequestForm";
import { REQUEST_TYPES } from "../Form/RequestForm.types";
import { PageLayout } from "@/shared/layouts/PageLayout";

export function SuggestionPage() {
  return (
    <PageLayout>
      <RequestForm requestTypeId={REQUEST_TYPES.SUGGESTION} />
    </PageLayout>
  );
}

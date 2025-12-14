import React from "react";
import { RequestForm } from "../Form/RequestForm";
import { REQUEST_TYPES } from "../Form/RequestForm.types";
import { PageLayout } from "@/shared/layouts/PageLayout";

export function InquiryPage() {
  return (
    <PageLayout>
      <RequestForm requestTypeId={REQUEST_TYPES.INQUIRY} />
    </PageLayout>
  );
}

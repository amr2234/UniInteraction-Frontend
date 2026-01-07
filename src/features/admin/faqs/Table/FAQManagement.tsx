import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useFaqs, useDeleteFaq, useToggleFaqStatus } from "../hooks/useFaqs";
import type { FaqFilters } from "../types/faq.types";
import { useI18n } from "@/i18n";
import type { FaqDto } from "@/core/types/api";

export function FAQManagement() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqDto | null>(null);

  // Prepare filters
  const filters: FaqFilters = {
    searchTerm: searchTerm || undefined,
    isActive: activeFilter === "all" ? undefined : activeFilter === "active",
    pageNumber,
    pageSize,
  };

  // Fetch FAQs
  const { data: faqsData, isLoading } = useFaqs(filters);
  const deleteFaqMutation = useDeleteFaq();
  const toggleStatusMutation = useToggleFaqStatus();

  const faqs = faqsData?.items || [];
  const totalCount = faqsData?.totalCount || 0;
  const totalPages = faqsData?.totalPages || 0;

  const handleDeleteFaq = async () => {
    if (!selectedFaq) return;

    try {
      await deleteFaqMutation.mutateAsync(selectedFaq.id);
      setIsDeleteDialogOpen(false);
      setSelectedFaq(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedFaq(null);
  };

  const handleToggleStatus = async (faq: FaqDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: faq.id,
        isActive: !faq.isActive,
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          {t('navigation.goToDashboard')}
        </Button>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[#2B2B2B] mb-2">{t('faq.manageFaqs')}</h1>
            <p className="text-[#6F6F6F]">{t('faq.manageFaqsDesc')}</p>
          </div>
          <Button
            onClick={() => navigate("/admin/faqs/new")}
            className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {t('faq.addNewFaq')}
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                placeholder={t('faq.searchFaqs')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 rounded-xl"
              />
            </div>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t('faq.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('faq.allFaqs')}</SelectItem>
                <SelectItem value="active">{t('faq.activeOnly')}</SelectItem>
                <SelectItem value="inactive">{t('faq.inactiveOnly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-semibold text-gray-700 w-[50px]">#</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[80px]">
                    {t('faq.order')}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[250px]">
                    {t('faq.questionArLabel')}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[250px]">
                    {t('faq.questionEnLabel')}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[300px]">
                    {t('faq.answerArLabel')}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[300px]">
                    {t('faq.answerEnLabel')}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[100px]">
                    {t('faq.status')}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[150px]">
                    {t('faq.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      {t('faq.loading')}
                    </TableCell>
                  </TableRow>
                ) : faqs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      {t('faq.noResults')}
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq, index) => (
                    <TableRow key={faq.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium">
                        {(pageNumber - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#6CAEBD]/10 text-[#6CAEBD] font-semibold">
                          {faq.order}
                        </span>
                      </TableCell>
                      <TableCell className="text-center overflow-hidden">
                        <p className="font-medium text-[#2B2B2B]" style={{ wordBreak: 'break-all', maxWidth: '15.625rem', marginLeft: 'auto', marginRight: 'auto' }}>
                          {faq.questionAr}
                        </p>
                      </TableCell>
                      <TableCell className="text-center overflow-hidden">
                        {faq.questionEn ? (
                          <p className="text-sm text-gray-700" style={{ wordBreak: 'break-all', maxWidth: '15.625rem', marginLeft: 'auto', marginRight: 'auto' }}>
                            {faq.questionEn}
                          </p>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center overflow-hidden">
                        <p className="text-sm text-gray-700" style={{ wordBreak: 'break-all', maxWidth: '18.75rem', marginLeft: 'auto', marginRight: 'auto' }}>
                          {faq.answerAr}
                        </p>
                      </TableCell>
                      <TableCell className="text-center overflow-hidden">
                        {faq.answerEn ? (
                          <p className="text-sm text-gray-700" style={{ wordBreak: 'break-all', maxWidth: '18.75rem', marginLeft: 'auto', marginRight: 'auto' }}>
                            {faq.answerEn}
                          </p>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={faq.isActive ? "default" : "secondary"}
                          className={
                            faq.isActive
                              ? "bg-green-500 hover:bg-green-600 text-black"
                              : "bg-gray-400 hover:bg-gray-500 text-black"
                          }
                        >
                          {faq.isActive ? t('users.active') : t('users.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/faqs/edit/${faq.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(faq)}
                            disabled={toggleStatusMutation.isPending}
                            className={
                              faq.isActive
                                ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                                : "text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                            }
                          >
                            {faq.isActive ? (
                              <ToggleRight className="w-4 h-4" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Blur the active element to prevent aria-hidden focus trap warning
                              if (document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur();
                              }
                              setSelectedFaq(faq);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            disabled={deleteFaqMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                {t('common.showing')} {(pageNumber - 1) * pageSize + 1} -{" "}
                {Math.min(pageNumber * pageSize, totalCount)} {t('common.of')}{" "}
                {totalCount}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber === 1}
                  className="rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                  {t('common.previous')}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={pageNumber === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPageNumber(page)}
                        className={`rounded-xl min-w-[40px] ${
                          pageNumber === page
                            ? "bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 text-white"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={pageNumber === totalPages}
                  className="rounded-xl"
                >
                  {t('common.next')}
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('messages.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('faq.deleteConfirm')} "{selectedFaq?.questionAr}"؟ {t('messages.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFaq}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteFaqMutation.isPending}
            >
              {deleteFaqMutation.isPending ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

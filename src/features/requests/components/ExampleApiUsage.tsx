// ============================================
// Example: How to use the API hooks in components
// ============================================

import React, { useState } from 'react';
import {
  useCreateRequest,
  useUserRequests,
  useRequestDetails,
} from '@/features/requests/hooks/useRequests';
import {
  useRequestTypes,
  useRequestStatuses,
  useMainCategories,
  useSubCategories,
  useServices,
} from '@/features/lookups/hooks/useLookups';
import { CreateRequestPayload } from '@/core/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ExampleRequestForm = () => {
  // ========== Fetch Lookups ==========
  const { data: requestTypes, isLoading: loadingTypes } = useRequestTypes();
  const { data: requestStatuses } = useRequestStatuses();
  const { data: mainCategories } = useMainCategories();
  
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | undefined>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | undefined>();
  
  // Fetch subcategories based on selected main category
  const { data: subCategories } = useSubCategories(selectedMainCategory);
  
  // Fetch services based on selected subcategory
  const { data: services } = useServices(selectedSubCategory);

  // ========== Form State ==========
  const [formData, setFormData] = useState<CreateRequestPayload>({
    nameAr: '',
    email: '',
    mobile: '',
    titleAr: '',
    subjectAr: '',
    requestTypeId: 1,
  });

  // ========== Mutations ==========
  const createRequest = useCreateRequest();

  // ========== Queries ==========
  // Get all user requests
  const { data: userRequests, isLoading: loadingRequests } = useUserRequests();

  // Get specific request details
  const requestNumber = 'SG-2025-001234';
  const { data: requestDetails, isLoading: loadingDetails } = useRequestDetails(requestNumber);

  // ========== Handlers ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createRequest.mutateAsync(formData);
      // Form will reset automatically, and toast notification will show
      // User requests list will be automatically refetched
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to create request:', error);
    }
  };

  const handleInputChange = (field: keyof CreateRequestPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">إنشاء طلب جديد</h2>

      {/* ========== Create Request Form ========== */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nameAr">الاسم بالعربي</Label>
          <Input
            id="nameAr"
            value={formData.nameAr}
            onChange={(e) => handleInputChange('nameAr', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="mobile">رقم الجوال</Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="requestTypeId">نوع الطلب</Label>
          <Select
            value={formData.requestTypeId?.toString()}
            onValueChange={(value: string) => handleInputChange('requestTypeId', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع الطلب" />
            </SelectTrigger>
            <SelectContent>
              {loadingTypes && <SelectItem value="loading">جاري التحميل...</SelectItem>}
              {requestTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mainCategory">التصنيف الرئيسي</Label>
          <Select
            value={selectedMainCategory?.toString()}
            onValueChange={(value: string) => {
              const id = parseInt(value);
              setSelectedMainCategory(id);
              handleInputChange('mainCategoryId', id);
              setSelectedSubCategory(undefined);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر التصنيف الرئيسي" />
            </SelectTrigger>
            <SelectContent>
              {mainCategories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subCategory">التصنيف الفرعي</Label>
          <Select
            value={selectedSubCategory?.toString()}
            onValueChange={(value: string) => {
              const id = parseInt(value);
              setSelectedSubCategory(id);
              handleInputChange('subCategoryId', id);
            }}
            disabled={!selectedMainCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر التصنيف الفرعي" />
            </SelectTrigger>
            <SelectContent>
              {subCategories?.map((sub) => (
                <SelectItem key={sub.id} value={sub.id.toString()}>
                  {sub.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="service">الخدمة</Label>
          <Select
            value={formData.serviceId?.toString()}
            onValueChange={(value: string) => handleInputChange('serviceId', parseInt(value))}
            disabled={!selectedSubCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الخدمة" />
            </SelectTrigger>
            <SelectContent>
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="titleAr">عنوان الطلب</Label>
          <Input
            id="titleAr"
            value={formData.titleAr}
            onChange={(e) => handleInputChange('titleAr', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="subjectAr">الموضوع</Label>
          <Input
            id="subjectAr"
            value={formData.subjectAr}
            onChange={(e) => handleInputChange('subjectAr', e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={createRequest.isPending} className="w-full">
          {createRequest.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </Button>
      </form>

      {/* ========== Display User Requests ========== */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">طلباتي</h3>
        
        {loadingRequests && <p>جاري التحميل...</p>}
        
        {userRequests && userRequests.length > 0 && (
          <ul className="space-y-2">
            {userRequests.map((request) => (
              <li key={request.id} className="p-4 border rounded-lg">
                <p className="font-semibold">{request.titleAr}</p>
                <p className="text-sm text-gray-600">رقم الطلب: {request.requestNumber}</p>
                <p className="text-sm text-gray-600">الحالة: {request.statusName}</p>
              </li>
            ))}
          </ul>
        )}
        
        {userRequests && userRequests.length === 0 && (
          <p className="text-gray-500">لا توجد طلبات</p>
        )}
      </div>

      {/* ========== Display Request Details ========== */}
      {requestDetails && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">تفاصيل الطلب</h3>
          <div className="p-4 border rounded-lg">
            <p><strong>رقم الطلب:</strong> {requestDetails.requestNumber}</p>
            <p><strong>العنوان:</strong> {requestDetails.titleAr}</p>
            <p><strong>الحالة:</strong> {requestDetails.statusName}</p>
            <p><strong>التاريخ:</strong> {new Date(requestDetails.createdAt).toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// Example: Using mutations with callbacks
// ============================================

export const ExampleWithCallbacks = () => {
  const createRequest = useCreateRequest();

  const handleCreateWithCallback = () => {
    const payload: CreateRequestPayload = {
      nameAr: 'أحمد محمد',
      email: 'ahmed@example.com',
      mobile: '+966501234567',
      titleAr: 'طلب استفسار',
      subjectAr: 'استفسار عن الدرجات',
      requestTypeId: 1,
    };

    createRequest.mutate(payload, {
      onSuccess: (data) => {
        console.log('Request created successfully:', data);
        // Do something with the data
      },
      onError: (error) => {
        console.error('Failed to create request:', error);
        // Handle error
      },
    });
  };

  return (
    <Button onClick={handleCreateWithCallback}>
      إنشاء طلب مع callbacks
    </Button>
  );
};

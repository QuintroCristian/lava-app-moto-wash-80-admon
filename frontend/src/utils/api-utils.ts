import { toast } from "sonner";
import axios from "axios";

interface ApiError {
  status: string;
  type: string;
  message: string;
  code: number;
  errors?: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

interface ApiSuccess<T> {
  status: string;
  code: number;
  data?: T;
  message?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
}

type ApiOptions = {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
};

export async function handleApiResponse<T>(
  handler: () => Promise<{ data: ApiSuccess<T> }>,
  { showSuccessMessage = true, showErrorMessage = true }: ApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await handler();
    if (showSuccessMessage && response.data.message) {
      toast.success(response.data.message);
    }
    return {
      success: true,
      data: response.data.data || (null as T),
    };
  } catch (error) {
    if (showErrorMessage && axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      if (apiError.errors) {
        for (const error of apiError.errors) {
          toast.error(error.message);
        }
      } else {
        toast.error(apiError.message);
      }
    }
    return {
      success: false,
    };
  }
}

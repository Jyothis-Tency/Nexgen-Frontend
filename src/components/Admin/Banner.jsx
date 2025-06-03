"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Eye, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";

// Real API functions
const getBanners = async () => {
  try {
    const response = await adminAxiosInstance.get(`/all-banners`);
    return response.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

const getBannerById = async (bannerId) => {
  try {
    const response = await adminAxiosInstance.get(`/banner/${bannerId}`);

    return response.data;
  } catch (error) {
    console.error(`Error fetching banner ${bannerId}:`, error);
    throw error;
  }
};

const addBanner = async (formData) => {
  try {
    const response = await adminAxiosInstance.post(`/add-banner`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding banner:", error);
    throw error;
  }
};

const toggleBannerStatus = async (bannerId, active) => {
  try {
    const response = await adminAxiosInstance.put(
      `/activate-deactivate-banner/${bannerId}`,
      {
        active,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating banner ${bannerId} status:`, error);
    throw error;
  }
};

const deleteBanner = async (bannerId) => {
  try {
    const response = await adminAxiosInstance.delete(
      `/delete-banner/${bannerId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting banner ${bannerId}:`, error);
    throw error;
  }
};

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBanners();

      if (response && response.data) {
        // Map the backend data structure to our frontend structure
        const mappedBanners = response.data.map((banner) => ({
          id: banner._id,
          fileName: banner.fileName,
          imageUrl: banner.image, // This comes from the signed URL in the service
          createdAt: banner.createdAt,
          active: banner.active,
        }));
        setBanners(mappedBanners);
      }
    } catch (error) {
      toast.error("Failed to load banners");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("banner", imageFile); // Match the field name expected by the backend

      const response = await addBanner(formData);

      if (response) {
        toast.success("Banner added successfully");
        setAddDialogOpen(false);
        resetForm();
        fetchBanners(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add banner");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (bannerId, currentStatus) => {
    try {
      setStatusUpdating(bannerId);
      const newStatus = !currentStatus;

      const response = await toggleBannerStatus(bannerId, newStatus);

      if (response) {
        toast.success(
          `Banner ${newStatus ? "activated" : "deactivated"} successfully`
        );

        // Update local state
        setBanners(
          banners.map((banner) =>
            banner.id === bannerId ? { ...banner, active: newStatus } : banner
          )
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update banner status"
      );
      console.error(error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const response = await deleteBanner(bannerId);

      if (response) {
        toast.success("Banner deleted successfully");
        // Update local state to remove the deleted banner
        setBanners(banners.filter((banner) => banner.id !== bannerId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete banner");
      console.error(error);
    }
  };

  const handleViewBanner = async (banner) => {
    try {
      // Get detailed banner info if needed
      const response = await getBannerById(banner.id);

      if (response && response.data) {
        setCurrentBanner({
          ...banner,
          ...response.data,
        });
        setViewDialogOpen(true);
      }
    } catch (error) {
      toast.error("Failed to load banner details");
      console.error(error);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header and controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Banner Management</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>
                Upload a new banner image to display on the website.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBanner}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="image">Banner Image</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="max-h-[200px] mx-auto object-contain rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Recommended: 400 x 200 px
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Banner"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner List */}
      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
          <CardDescription>
            Manage promotional banners displayed on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {banners.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="h-16 w-32 relative">
                        <img
                          src={banner.imageUrl || "/placeholder.svg"}
                          alt={banner.fileName}
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {banner.fileName}
                    </TableCell>
                    <TableCell>
                      {new Date(banner.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={banner.active}
                          disabled={statusUpdating === banner.id}
                          onCheckedChange={() =>
                            handleToggleStatus(banner.id, banner.active)
                          }
                        />
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            banner.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusUpdating === banner.id ? (
                            <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                          ) : null}
                          {banner.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewBanner(banner)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this banner?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Upload className="h-10 w-10 mx-auto mb-2" />
              <p>No banners added yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setAddDialogOpen(true)}
              >
                Add Your First Banner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Banner Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Banner Details</DialogTitle>
          </DialogHeader>
          {currentBanner && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <img
                  src={currentBanner.imageUrl || "/placeholder.svg"}
                  alt={currentBanner.fileName}
                  className="max-h-[300px] object-contain rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">File Name</p>
                  <p>{currentBanner.fileName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        currentBanner.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {currentBanner.active ? "Active" : "Inactive"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleStatus(
                          currentBanner.id,
                          currentBanner.active
                        )
                      }
                      disabled={statusUpdating === currentBanner.id}
                    >
                      {statusUpdating === currentBanner.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : currentBanner.active ? (
                        "Deactivate"
                      ) : (
                        "Activate"
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p>
                    {new Date(currentBanner.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Updated
                  </p>
                  <p>
                    {currentBanner.updatedAt
                      ? new Date(currentBanner.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerManagement;

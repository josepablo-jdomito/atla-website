import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type Project, type InsertProject } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { z } from "zod";

const CATEGORIES = [
  "Brand Identity",
  "Motion Design",
  "Web Design",
  "Print",
  "Packaging",
  "Art Direction",
  "Visual Identity",
  "Campaign",
];

const formSchema = insertProjectSchema.extend({
  tagsRaw: z.string().optional(),
  imagesRaw: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ProjectForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: InsertProject) => void;
  isPending: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      client: "",
      year: new Date().getFullYear(),
      category: "",
      description: "",
      body: "",
      coverImage: "",
      featured: false,
      status: "draft",
      tagsRaw: "",
      imagesRaw: "",
      ...defaultValues,
    },
  });

  const title = form.watch("title");

  function handleSubmit(data: FormValues) {
    const { tagsRaw, imagesRaw, ...rest } = data;
    onSubmit({
      ...rest,
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
      images: imagesRaw ? imagesRaw.split("\n").map((u) => u.trim()).filter(Boolean) : [],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    data-testid="input-title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!defaultValues?.slug) {
                        form.setValue("slug", toSlug(e.target.value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input data-testid="input-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input data-testid="input-client" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    data-testid="input-year"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea data-testid="textarea-description" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Copy</FormLabel>
              <FormControl>
                <Textarea data-testid="textarea-body" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input data-testid="input-cover-image" placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagsRaw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input data-testid="input-tags" placeholder="logo, typography, editorial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imagesRaw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery Image URLs (one per line)</FormLabel>
              <FormControl>
                <Textarea data-testid="textarea-images" rows={3} placeholder={"https://...\nhttps://..."} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <input
                  data-testid="checkbox-featured"
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 accent-[#222]"
                />
              </FormControl>
              <FormLabel className="!mt-0">Featured on homepage</FormLabel>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button data-testid="button-save" type="submit" disabled={isPending} className="bg-[#222] text-white hover:bg-[#444]">
            {isPending ? "Saving…" : "Save Project"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function ProjectsAdmin() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: projectList = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest("POST", "/api/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsCreateOpen(false);
      toast({ title: "Project created" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertProject> }) =>
      apiRequest("PATCH", `/api/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditProject(null);
      toast({ title: "Project updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setDeleteId(null);
      toast({ title: "Project deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const toggleFeatured = (project: Project) => {
    updateMutation.mutate({ id: project.id, data: { featured: !project.featured } });
  };

  const toggleStatus = (project: Project) => {
    updateMutation.mutate({
      id: project.id,
      data: { status: project.status === "published" ? "draft" : "published" },
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-['Libre_Franklin',Helvetica,sans-serif]">
      <header className="border-b border-[#e8e8e8] bg-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-[#222] tracking-tight">Atla</span>
          <span className="text-sm text-[#8e8e8e]">/ Projects CMS</span>
        </div>
        <Button
          data-testid="button-new-project"
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#222] text-white hover:bg-[#444] text-sm"
        >
          + New Project
        </Button>
      </header>

      <main className="px-8 py-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#222]">All Projects</h1>
          <p className="text-sm text-[#8e8e8e] mt-1">
            {projectList.length} project{projectList.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-[#8e8e8e]">Loading…</div>
        ) : projectList.length === 0 ? (
          <div className="border border-dashed border-[#ddd] rounded-lg flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-[#8e8e8e] text-sm">No projects yet</p>
            <Button
              data-testid="button-first-project"
              onClick={() => setIsCreateOpen(true)}
              variant="outline"
              className="text-sm"
            >
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="space-y-px border border-[#e8e8e8] rounded-lg overflow-hidden bg-white">
            <div className="grid grid-cols-[2fr_1fr_1fr_80px_80px_100px] gap-4 px-5 py-3 text-xs uppercase tracking-widest text-[#8e8e8e] border-b border-[#e8e8e8]">
              <span>Project</span>
              <span>Client</span>
              <span>Category</span>
              <span>Year</span>
              <span>Status</span>
              <span></span>
            </div>
            {projectList.map((project) => (
              <div
                key={project.id}
                data-testid={`row-project-${project.id}`}
                className="grid grid-cols-[2fr_1fr_1fr_80px_80px_100px] gap-4 px-5 py-4 items-center hover:bg-[#fafafa] border-b border-[#f0f0f0] last:border-0"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#222] text-sm">{project.title}</span>
                    {project.featured && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#ffc629] text-[#222] border-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-[#8e8e8e]">/work/{project.slug}</span>
                </div>
                <span className="text-sm text-[#444]">{project.client}</span>
                <span className="text-sm text-[#444]">{project.category}</span>
                <span className="text-sm text-[#444]">{project.year}</span>
                <div>
                  <button
                    data-testid={`status-toggle-${project.id}`}
                    onClick={() => toggleStatus(project)}
                    className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                      project.status === "published"
                        ? "bg-[#e8f5e9] text-[#2e7d32]"
                        : "bg-[#f5f5f5] text-[#757575]"
                    }`}
                  >
                    {project.status === "published" ? "Live" : "Draft"}
                  </button>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <button
                    data-testid={`button-star-${project.id}`}
                    onClick={() => toggleFeatured(project)}
                    title={project.featured ? "Unfeature" : "Feature"}
                    className="p-1.5 rounded hover:bg-[#f0f0f0] text-[#8e8e8e] hover:text-[#222] transition-colors"
                  >
                    {project.featured ? "★" : "☆"}
                  </button>
                  <button
                    data-testid={`button-edit-${project.id}`}
                    onClick={() => setEditProject(project)}
                    className="p-1.5 rounded hover:bg-[#f0f0f0] text-[#8e8e8e] hover:text-[#222] transition-colors text-xs"
                  >
                    Edit
                  </button>
                  <button
                    data-testid={`button-delete-${project.id}`}
                    onClick={() => setDeleteId(project.id)}
                    className="p-1.5 rounded hover:bg-[#fee2e2] text-[#8e8e8e] hover:text-[#dc2626] transition-colors text-xs"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editProject && (
            <ProjectForm
              defaultValues={{
                ...editProject,
                tagsRaw: editProject.tags.join(", "),
                imagesRaw: editProject.images.join("\n"),
              }}
              onSubmit={(data) => updateMutation.mutate({ id: editProject.id, data })}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-[#dc2626] hover:bg-[#b91c1c]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

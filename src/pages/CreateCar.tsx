import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { db, storage } from "@/appwrite/appwrite";
import { ID } from "appwrite";

const createCarSchema = z.object({
  title: z.string().min(1,"Title can not be Empty"),
  description: z.string().min(1,"Description can not be Empty"),
  images: z.array(z.instanceof(FileList)),
  tags: z.array(z.string()),
  tagInput: z.string().optional(),
});

type CreateCarType = z.infer<typeof createCarSchema>;

export default function CreateCar() {
  const { register, control, resetField, getValues, handleSubmit,formState : {errors} } =
    useForm<CreateCarType>({
      resolver: zodResolver(createCarSchema),
    });
  const {
    fields: imagesField,
    remove,
    append,
  } = useFieldArray({ control, name: "images" });
  const {
    fields: tagsField,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });
  async function submitForm({
    title,
    description,
    images,
    tags,
  }: CreateCarType) {
    console.log("submitting");
    // upload images
    let imgIds: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const res = await storage.createFile(
        "6737a5bf0001c7ebdf95",
        ID.unique(),
        images[i][0]
      );
      imgIds.push(res.$id);
    }
    const res = await db.createDocument(
      "6737970c00218f6f57e3",
      "67379719001516e08d1f",
      ID.unique(),
      { title, description, tags, images: imgIds }
    );
    console.log(res.$id);
  }
  let tags = getValues("tags");
  return (
    <div className="container p-4">
      <h1 className="font-bold text-2xl mb-4">Add a car</h1>
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            {...register("title")}
            placeholder="Enter Title"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter Description"
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>
        <div>
          <Label>Tags</Label>
          <div className="flex items-center">
            <Input
              placeholder="Enter tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  appendTag(getValues("tagInput"));
                  resetField("tagInput");
                }
              }}
              {...register("tagInput")}
            />
          </div>
          <div className="space-x-1 space-y-1">
            {tagsField.map((field, index) => (
              <Badge
                className="hover:cursor-pointer"
                key={field.id}
                onClick={() => {
                  removeTag(index);
                }}
              >
                {tags[index]}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {imagesField.map((field, index) => (
            <div key={field.id} className="flex items-center">
              <Input
                id={field.id}
                type="file"
                {...register(`images.${index}`)}
              />
              <Button
                onClick={() => {
                  remove(index);
                }}
              >
                remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              append("xyz");
            }}
          >
            add images
          </Button>
        </div>
        <Button type="submit">submit</Button>
      </form>
    </div>
  );
}

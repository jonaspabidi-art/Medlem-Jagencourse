export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_path: string;
  duration_sec: number | null;
  sort_order: number;
};

export type ModuleRow = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
};

export type ModuleWithLessons = ModuleRow & {
  lessons: Lesson[];
};

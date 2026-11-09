import { Download, ExternalLink } from 'lucide-react';
import { parseVideo } from '../utils/video';
import ArticleBody from './ArticleBody';

function Video({ url, title }) {
  const v = parseVideo(url);
  if (v.kind === 'embed') {
    return <div className="aspect-video overflow-hidden rounded-xl border border-line bg-black"><iframe src={v.src} title={title} className="h-full w-full" allow="fullscreen; picture-in-picture; encrypted-media" referrerPolicy="strict-origin-when-cross-origin" loading="lazy" /></div>;
  }
  if (v.kind === 'file') return <video src={v.src} controls preload="metadata" className="aspect-video w-full rounded-xl border border-line bg-black" />;
  return <a href={v.src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-3 text-sm underline"><ExternalLink className="h-4 w-4" aria-hidden /> Open the video in a new tab</a>;
}

// Shows a video, text or assignment brief plus downloadable resources. Quizzes are rendered by QuizPlayer.
export default function LessonContent({ lesson }) {
  return (
    <div className="space-y-6">
      {lesson.type === 'video' && lesson.videoUrl && <Video url={lesson.videoUrl} title={lesson.title} />}
      {lesson.type === 'text' && <ArticleBody html={lesson.content} />}
      {lesson.resources?.length > 0 && (
        <section aria-labelledby="res-h">
          <h2 id="res-h" className="text-sm font-semibold">Resources</h2>
          <ul className="mt-2 space-y-2">
            {lesson.resources.map((r) => (
              <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm underline"><Download className="h-4 w-4" aria-hidden /> {r.name}</a></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

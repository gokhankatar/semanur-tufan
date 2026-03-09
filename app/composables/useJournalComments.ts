import type { IncomingComment, JournalComment } from "~/interfaces/journalComment";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function toPlainObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && "seconds" in v && "nanoseconds" in v) {
      result[k] = {
        seconds: (v as { seconds: number }).seconds,
        nanoseconds: (v as { nanoseconds: number }).nanoseconds,
      };
    } else {
      result[k] = v;
    }
  }
  return result;
}

export function useJournalComments() {
  const { $firestore } = useNuxtApp();

  const fetchIncomingComments = async (): Promise<IncomingComment[]> => {
    const q = query(
      collection($firestore, "incoming_comments"),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const created = data.created_at as { seconds?: number } | undefined;
      const createdStr = created?.seconds
        ? new Date(created.seconds * 1000).toISOString()
        : undefined;
      const plain = toPlainObject(data);
      return { ...plain, id: d.id, created_at: createdStr } as IncomingComment;
    });
  };

  const addIncomingComment = async (
    data: Omit<IncomingComment, "id" | "created_at" | "status">
  ) => {
    const docRef = await addDoc(collection($firestore, "incoming_comments"), {
      ...data,
      status: "pending",
      created_at: serverTimestamp(),
    });
    return docRef.id;
  };

  const deleteIncomingComment = async (id: string) => {
    await deleteDoc(doc($firestore, "incoming_comments", id));
  };

  const approveComment = async (
    incoming: IncomingComment,
    journalId: string
  ): Promise<void> => {
    const comment: JournalComment = {
      id: randomId(),
      author_name: incoming.is_anonymous ? "Anonim" : (incoming.author_name ?? "Anonim"),
      comment_text: incoming.comment_text,
      created_at:
        typeof incoming.created_at === "string"
          ? incoming.created_at
          : incoming.created_at?.seconds
            ? new Date(incoming.created_at.seconds * 1000).toISOString()
            : new Date().toISOString(),
      visible: true,
    };

    await updateDoc(doc($firestore, "journals", journalId), {
      comments: arrayUnion(comment),
    });

    if (incoming.id) {
      await deleteDoc(doc($firestore, "incoming_comments", incoming.id));
    }
  };

  const toggleCommentVisibility = async (
    journalId: string,
    comments: JournalComment[],
    commentId: string
  ) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, visible: !c.visible } : c
    );
    await updateDoc(doc($firestore, "journals", journalId), {
      comments: updated,
    });
  };

  const removeCommentFromJournal = async (
    journalId: string,
    comments: JournalComment[],
    commentId: string
  ) => {
    const updated = comments.filter((c) => c.id !== commentId);
    await updateDoc(doc($firestore, "journals", journalId), {
      comments: updated,
    });
  };

  return {
    fetchIncomingComments,
    addIncomingComment,
    deleteIncomingComment,
    approveComment,
    toggleCommentVisibility,
    removeCommentFromJournal,
  };
}

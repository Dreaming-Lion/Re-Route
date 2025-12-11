import React, { useState, FormEvent } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { LinearGradient } from "expo-linear-gradient";

const GRAD = ["#cfefff", "#d7f7e9"];

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    title: "충주 캠퍼스 밥집 추천 모음",
    content: "학식 말고 갈만한 곳 정리해봤어요. 다들 댓글로 추가해주세요!",
    createdAt: "2025-12-10 14:30",
  },
  {
    id: 2,
    title: "셔틀 시간표 같이 정리하실 분?",
    content: "셔틀, 시내버스 시간 한 번에 보이게 정리해보고 싶어요.",
    createdAt: "2025-12-10 13:05",
  },
];

type PostCardProps = {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  colors: any;
};

function PostCard({ post, onEdit, onDelete, colors }: PostCardProps) {
  return (
    <View
      style={[
        s.postCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={s.postTopRow}>
        {/* 아이콘 박스 - SearchScreen 추천 카드 느낌 */}
        <View style={s.postIconCircle}>
          <Text style={s.postIconText}>글</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={s.postTitle}>{post.title}</Text>
          <Text style={s.postContent}>{post.content}</Text>
          <Text style={s.postDate}>{post.createdAt}</Text>
        </View>
      </View>

      <View style={s.postActions}>
        <Pressable
          onPress={() => onEdit(post)}
          style={[s.postActionBtn, { borderColor: colors.border }]}
        >
          <Text style={s.postActionText}>수정</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(post.id)}
          style={[s.postActionBtn, { borderColor: "#fecaca" }]}
        >
          <Text style={[s.postActionText, { color: "#b91c1c" }]}>삭제</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CommunityScreen() {
  const { styles: themeStyles, colors } = useTheme();

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setIsModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert("삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          setPosts((prev) => prev.filter((p) => p.id !== id));
          if (editingId === id) {
            setEditingId(null);
            setTitle("");
            setContent("");
          }
        },
      },
    ]);
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e && "preventDefault" in e) e.preventDefault();

    if (!title.trim() || !content.trim()) {
      Alert.alert("입력 필요", "제목과 내용을 모두 입력해 주세요.");
      return;
    }

    const now = new Date();
    const formatted =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")} ` +
      `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

    if (editingId === null) {
      const newPost: Post = {
        id: posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
        title: title.trim(),
        content: content.trim(),
        createdAt: formatted,
      };
      setPosts([newPost, ...posts]);
    } else {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, title: title.trim(), content: content.trim() }
            : p
        )
      );
    }

    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  return (
    <View style={themeStyles.screen}>
      <Header title="커뮤니티" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 상단 헤더 + 새 글 버튼 */}
          <View style={s.listHeader}>
            <View>
              <Text style={s.listTitle}>게시글</Text>
              <Text style={s.listSubtitle}>
                총 {posts.length}개의 글이 있습니다.
              </Text>
            </View>
            <Pressable onPress={openCreateModal} style={s.writeBtnShadow}>
              <LinearGradient colors={GRAD} style={s.writeBtn}>
                <Icon name="create-outline" />
                <View style={{ width: 6 }} />
                <Text style={s.writeBtnText}>새 글 작성</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* 게시글 리스트 */}
          <View style={{ marginTop: 8 }}>
            {posts.length === 0 ? (
              <Text style={s.emptyText}>
                아직 등록된 글이 없습니다. 첫 글을 작성해보세요!
              </Text>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  colors={colors}
                />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 모달: 새 글 작성 / 수정 - 중앙 팝업 */}
      <Modal visible={isModalOpen} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: colors.card }]}>
            <Text style={s.modalTitle}>
              {editingId ? "게시글 수정" : "새 글 작성"}
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text style={s.modalLabel}>제목</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="예: 오늘 셔틀 시간 공유드립니다"
                style={[s.modalInput, { borderColor: colors.border }]}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={{ marginBottom: 4 }}>
              <Text style={s.modalLabel}>내용</Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="내용을 입력해 주세요."
                style={[s.modalTextarea, { borderColor: colors.border }]}
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={s.modalButtonsRow}>
              <Pressable
                onPress={closeModal}
                style={[s.modalGhostBtn, { borderColor: colors.border }]}
              >
                <Text style={s.modalGhostText}>취소</Text>
              </Pressable>

              <Pressable onPress={handleSubmit} style={s.modalPrimaryShadow}>
                <LinearGradient colors={GRAD} style={s.modalPrimaryBtn}>
                  <Text style={s.modalPrimaryText}>
                    {editingId ? "수정 완료" : "등록하기"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  // 리스트 상단
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  listSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  writeBtnShadow: {
    borderRadius: 999,
    overflow: "hidden",
  },
  writeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 999,
  },
  writeBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },

  // 게시글 카드
  postCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  postTopRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  postIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F7F4",
    alignItems: "center",
    justifyContent: "center",
  },
  postIconText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  postTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  postContent: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 4,
  },
  postDate: {
    fontSize: 11,
    color: "#94a3b8",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  postActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  postActionText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 12,
  },

  // 모달 (가운데 팝업)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",   // ⬅️ 가운데 정렬
    alignItems: "center",       // ⬅️ 가운데 정렬
  },
  modalBox: {
    width: "85%",               // ⬅️ 카드 폭
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,           // ⬅️ 네 모서리 모두 둥글게
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0f172a",
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#f9fafb",
  },
  modalTextarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#f9fafb",
    minHeight: 120,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  modalGhostBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  modalGhostText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  modalPrimaryShadow: {
    borderRadius: 12,
    overflow: "hidden",
  },
  modalPrimaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
});

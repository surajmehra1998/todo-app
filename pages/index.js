import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useAuth } from "@/firebase/auth";
import Loader from "@/components/Loader";
import { collection, addDoc, query, deleteDoc, updateDoc, doc, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Home() {
  const [todoInput, setTodoInput] = useState("");
  const [todo, setTodo] = useState([]);

  const router = useRouter();
  const { authUser, isLoading, signOut } = useAuth();
  useEffect(() => {
    if (!authUser && !isLoading) {
      router.push("/login");
    }
    if (authUser) {
      fetchTodoS(authUser.uid);
    }
  }, [authUser, isLoading, router]);
  // console.log(authUser);

  const addTodo = async () => {
    if (!todoInput && todoInput !== null) {
      alert("Input field can not be empty");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        owner: authUser.uid,
        content: todoInput,
        completed: false,
      });
      // console.log("Document written with ID: ", docRef.id);
      fetchTodoS(authUser.uid);
      setTodoInput("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (docId) => {
    try {
      await deleteDoc(doc(db, "todos", docId));
      fetchTodoS(authUser.uid);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (event, docId) => {
    try {
      const docRef = doc(db, "todos", docId);
      await updateDoc(docRef, {
        completed: event.target.checked,
      });
      fetchTodoS(authUser.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" && todo.length > 0) {
      addTodo();
    }
  };

  const fetchTodoS = async (uid) => {
    try {
      const q = query(collection(db, "todos"), where("owner", "==", uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodo(data);
    } catch (error) {
      console.error(error);
    }
  };
  return !authUser ? (
    <Loader />
  ) : (
    <main className="">
      <div
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={signOut}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-white -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold">ToooDooo's</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 Hello ${authUser?.username}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              value={todoInput}
              onChange={(e) => setTodoInput(() => e.target.value)}
              onKeyUp={onKeyUp}
              autoFocus
            />
            <button
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
              onClick={addTodo}
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {todo.length > 0 &&
            todo.map((todo, index) => (
              <div className="flex items-center justify-between mt-4" key={todo.id}>
                <div className="flex items-center gap-3">
                  <input
                    id={`todo-${todo?.id}`}
                    type="checkbox"
                    className="w-4 h-4 accent-green-400 rounded-lg"
                    checked={todo?.completed}
                    onChange={(e) => updateTodo(e, todo?.id)}
                  />
                  <label htmlFor={`todo-${todo?.id}`} className={`font-medium ${todo.completed ? `line-through` : ""}`}>
                    {todo?.content}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <MdDeleteForever
                    size={24}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                    onClick={() => deleteTodo(todo?.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

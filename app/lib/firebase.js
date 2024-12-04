"use server";
import {
  doc,
  collection,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { revalidatePath } from "next/cache";
import { VIEW_FLASHCARD_SETS_URL } from "./constants";
import { redirect } from "next/navigation";

// Check if a collection of flashcards exists for a user
export async function collectionExists(email, collectionName) {
  try {
    // Check if the collection exists by fetching the document
    const userDocRef = doc(collection(db, "users"), email);

    // Check if the users --> flashcardSets --> collectionName document exists
    const setDocRef = doc(
      collection(userDocRef, "flashcardSets"),
      collectionName
    );

    // Get the document snapshot
    const setDocSnap = await getDoc(setDocRef);

    return setDocSnap.exists();
  } catch (error) {
    console.error("Error checking if collection exists:", error);
    throw new Error("Error checking if collection exists");
  }
}

// Get a collection by id
export async function getCollection(email, collectionName) {
  const userDocRef = doc(collection(db, "users"), email);
  const setDocRef = doc(
    collection(userDocRef, "flashcardSets"),
    collectionName
  );

  return getDoc(setDocRef);
}

// Save a collection of flashcards for a user
export async function saveCollection(email, collectionName, flashcards) {
  const lowerCaseCollectionName = collectionName.toLowerCase();
  try {
    const userDocRef = doc(collection(db, "users"), email);
    const userDocSnap = await getDoc(userDocRef);

    const batch = writeBatch(db);

    if (userDocSnap.exists()) {
      // User document exists, update the flashcardSets array
      const userData = userDocSnap.data();
      const updatedSets = [
        ...(userData.flashcardSets || []),
        { name: lowerCaseCollectionName },
      ];
      batch.update(userDocRef, { flashcardSets: updatedSets });
    } else {
      // User document doesn't exist, create a new one with flashcardSets array
      batch.set(userDocRef, {
        flashcardSets: [{ name: lowerCaseCollectionName }],
      });
    }

    const setDocRef = doc(
      collection(userDocRef, "flashcardSets"),
      lowerCaseCollectionName
    );
    // Create or update the flashcard set document
    batch.set(setDocRef, { flashcards });

    await batch.commit();

    revalidatePath(VIEW_FLASHCARD_SETS_URL);
    return { success: true };
  } catch (error) {
    console.error("Error saving flashcards:", error);
    throw new Error("Error saving flashcards");
  }
}

// Get all collections of flashcards for a user
export async function getFlashcardSets(email) {
  try {
    const userDocRef = doc(collection(db, "users"), email);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return [];
    }

    const flashcardSetsRef = collection(userDocRef, "flashcardSets");
    const flashcardSetsSnap = await getDocs(flashcardSetsRef);

    const flashcardSets = await Promise.all(
      flashcardSetsSnap.docs.map(async (docSnap) => {
        const setData = docSnap.data();
        return {
          id: docSnap.id,
          flashcards: setData.flashcards || [],
        };
      })
    );

    return flashcardSets;
  } catch (error) {
    console.error("Error getting collections:", error);
    throw new Error("Error getting collections");
  }
}

// Delete a flashcard set from a user
export async function deleteFlashcardSet(email, flashcardSetID) {
  try {
<<<<<<< HEAD
    console.log(`attempting to delete flashcard set: ${flashcardSetID} for user: ${email}`);
=======
>>>>>>> origin/main
    const userDocRef = doc(collection(db, "users"), email);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
<<<<<<< HEAD
      throw new Error("User does not exist")
=======
      throw new Error("User does not exist");
>>>>>>> origin/main
    }

    const flashcardSetRef = doc(
      collection(userDocRef, "flashcardSets"),
      flashcardSetID
    );

    const batch = writeBatch(db);

    batch.delete(flashcardSetRef);

    const userData = userDocSnap.data();
<<<<<<< HEAD
    const updatedSets = (userData.flashcardSets || []).filter((set) => set.name !== flashcardSetID);

    batch.update(userDocRef, {flashcardSets: updatedSets});

    await batch.commit();
    return {success: true};
=======
    const updatedSets = (userData.flashcardSets || []).filter(
      (set) => set.name !== flashcardSetID
    );

    batch.update(userDocRef, { flashcardSets: updatedSets });

    await batch.commit();

    revalidatePath(VIEW_FLASHCARD_SETS_URL);
>>>>>>> origin/main
  } catch (error) {
    console.error("Error deleting flashcard set: ", error);
    throw new Error("Error deleting flashcard set");
  }
<<<<<<< HEAD

=======
>>>>>>> origin/main
}

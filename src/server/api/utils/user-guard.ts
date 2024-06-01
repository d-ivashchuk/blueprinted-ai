const userGuard = (userId: string | null) => {
  if (!userId) {
    throw new Error("User not found");
  }
};

export default userGuard;

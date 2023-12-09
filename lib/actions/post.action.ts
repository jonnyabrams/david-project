"use server"

import { connectToDatabase } from "../db"

export const createPost = async (params: any) => {
  try {
    connectToDatabase()
  } catch (error) {
    
  }
}
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { connectMongoDB, disconnectDB } from '@/lib/db';
import User from '@/models/User';

 async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  await connectMongoDB();

  try {
    const result = await User.deleteOne({ _id: id });

    await disconnectDB();
    
    if (result.acknowledged !== true) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export default DELETE;
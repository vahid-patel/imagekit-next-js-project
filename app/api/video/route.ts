import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/db';
import Video, { IVideo } from '@/models/Video';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length == 0) {
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed To Fetch Videos' },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    const body: IVideo = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: 'Missing Required Fields' },
        { status: 400 }
      );
    }
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformations?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

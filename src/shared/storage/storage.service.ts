import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient<any, any, any>;
  private readonly logger = new Logger(StorageService.name);
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME');

    if (!supabaseUrl || !supabaseKey || !bucketName) {
      this.logger.error(
        'Supabase URL or Key or Bucket Name is missing in environment variables',
      );
      throw new Error('Supabase configuration is missing');
    }

    this.bucketName = bucketName;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(
    path: string,
    file: Buffer,
    contentType: string,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.log(error);
      this.logger.error(
        `Failed to upload file to ${this.bucketName}/${path}: ${error.message}`,
      );
      throw error;
    }

    return data.path;
  }

  getFileUrl(path: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async deleteFile(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      this.logger.error(
        `Failed to delete file from ${this.bucketName}/${path}: ${error.message}`,
      );
      throw error;
    }
  }
}

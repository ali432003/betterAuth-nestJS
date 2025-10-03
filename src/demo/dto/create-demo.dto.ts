import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateDemoDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

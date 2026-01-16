import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Password for the user account' })
  password: string;

  @ApiProperty({ 
    example: 'attendee', 
    enum: ['attendee'],
    description: 'Role of the user (only attendee allowed for public registration)',
    required: false
  })
  role?: string;
}

export class RegisterOrganizerDto {
  @ApiProperty({ example: 'Jane Smith', description: 'Full name of the organizer' })
  name: string;

  @ApiProperty({ example: 'jane.smith@example.com', description: 'Email address of the organizer' })
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Password for the organizer account' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Password' })
  password: string;
}

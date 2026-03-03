# Use the official Microsoft Playwright image as the base
# This image comes with all the necessary dependencies for Chromium, WebKit, and Firefox
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Set the working directory
WORKDIR /app

# Install bun
RUN apt-get update && apt-get install -y unzip
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Copy package.json and install dependencies
COPY package.json ./
RUN bun install

# Copy the rest of the application code
COPY . .

# Run the application
CMD ["bun", "run", "start"]
